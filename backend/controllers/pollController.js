const db = require("../config/db");

// ==========================================
// GET ALL POLLS WITH OPTIONS AND VOTE COUNTS
// ==========================================

const getPolls = (req, res) => {

    const sql = `
        SELECT
            p.poll_id,
            p.question,
            p.created_by,
            p.start_date,
            p.end_date,
            p.status,
            p.created_at,

            po.option_id,
            po.option_text,

            COUNT(pv.vote_id) AS vote_count

        FROM polls p

        LEFT JOIN poll_options po
            ON p.poll_id = po.poll_id

        LEFT JOIN poll_votes pv
            ON po.option_id = pv.option_id

        GROUP BY
            p.poll_id,
            p.question,
            p.created_by,
            p.start_date,
            p.end_date,
            p.status,
            p.created_at,
            po.option_id,
            po.option_text

        ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Error fetching polls:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch polls"
            });
        }

        const polls = [];

        results.forEach((row) => {

            let poll = polls.find(
                (item) =>
                    item.poll_id === row.poll_id
            );

            if (!poll) {

                poll = {

                    poll_id: row.poll_id,

                    question: row.question,

                    created_by: row.created_by,

                    start_date: row.start_date,

                    end_date: row.end_date,

                    status: row.status,

                    created_at: row.created_at,

                    options: []

                };

                polls.push(poll);
            }

            if (row.option_id) {

                poll.options.push({

                    option_id: row.option_id,

                    option_text: row.option_text,

                    vote_count:
                        Number(row.vote_count)

                });
            }

        });

        res.json(polls);
    });
};


// ==========================================
// CREATE POLL
// ==========================================

const createPoll = (req, res) => {

    const {
        question,
        created_by,
        start_date,
        end_date,
        option1,
        option2
    } = req.body;

    if (
        !question ||
        !option1 ||
        !option2
    ) {

        return res.status(400).json({

            message:
                "Question and both options are required"

        });
    }

    const pollSql = `
        INSERT INTO polls
        (
            question,
            created_by,
            start_date,
            end_date,
            status
        )
        VALUES (?, ?, ?, ?, 'Active')
    `;

    const pollValues = [

        question,

        created_by || null,

        start_date || null,

        end_date || null

    ];

    db.query(
        pollSql,
        pollValues,
        (err, pollResult) => {

            if (err) {

                console.error(
                    "Error creating poll:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to create poll"

                });
            }

            const pollId =
                pollResult.insertId;

            const optionSql = `
                INSERT INTO poll_options
                (
                    poll_id,
                    option_text
                )
                VALUES (?, ?), (?, ?)
            `;

            const optionValues = [

                pollId,
                option1,

                pollId,
                option2

            ];

            db.query(
                optionSql,
                optionValues,
                (err) => {

                    if (err) {

                        console.error(
                            "Error creating poll options:",
                            err
                        );

                        return res.status(500).json({

                            message:
                                "Poll created but options could not be created"

                        });
                    }

                    res.status(201).json({

                        message:
                            "Poll created successfully",

                        poll_id:
                            pollId

                    });
                }
            );
        }
    );
};


// ==========================================
// VOTE IN POLL
// ==========================================

const votePoll = (req, res) => {

    const { pollId } = req.params;

    const {
        resident_id,
        option_id
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
        !resident_id ||
        !option_id
    ) {

        return res.status(400).json({

            message:
                "Resident and option are required"

        });
    }


    // ==========================================
    // CHECK POLL
    // ==========================================

    const pollSql = `
        SELECT
            poll_id,
            status
        FROM polls
        WHERE poll_id = ?
    `;

    db.query(
        pollSql,
        [pollId],
        (err, pollResults) => {

            if (err) {

                console.error(
                    "Error checking poll:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to check poll"

                });
            }


            if (pollResults.length === 0) {

                return res.status(404).json({

                    message:
                        "Poll not found"

                });
            }


            if (
                pollResults[0].status !==
                "Active"
            ) {

                return res.status(400).json({

                    message:
                        "This poll is closed"

                });
            }


            // ==========================================
            // CHECK OPTION BELONGS TO POLL
            // ==========================================

            const optionSql = `
                SELECT option_id
                FROM poll_options
                WHERE option_id = ?
                AND poll_id = ?
            `;

            db.query(
                optionSql,
                [option_id, pollId],
                (err, optionResults) => {

                    if (err) {

                        console.error(
                            "Error checking poll option:",
                            err
                        );

                        return res.status(500).json({

                            message:
                                "Failed to check poll option"

                        });
                    }


                    if (
                        optionResults.length === 0
                    ) {

                        return res.status(400).json({

                            message:
                                "Invalid poll option"

                        });
                    }


                    // ==========================================
                    // CHECK IF RESIDENT ALREADY VOTED
                    // ==========================================

                    const voteCheckSql = `
                        SELECT vote_id
                        FROM poll_votes
                        WHERE poll_id = ?
                        AND resident_id = ?
                    `;

                    db.query(
                        voteCheckSql,
                        [
                            pollId,
                            resident_id
                        ],
                        (err, existingVotes) => {

                            if (err) {

                                console.error(
                                    "Error checking existing vote:",
                                    err
                                );

                                return res.status(500).json({

                                    message:
                                        "Failed to check existing vote"

                                });
                            }


                            if (
                                existingVotes.length > 0
                            ) {

                                return res.status(409).json({

                                    message:
                                        "You have already voted in this poll"

                                });
                            }


                            // ==========================================
                            // SAVE VOTE
                            // ==========================================

                            const insertVoteSql = `
                                INSERT INTO poll_votes
                                (
                                    poll_id,
                                    option_id,
                                    resident_id
                                )
                                VALUES (?, ?, ?)
                            `;

                            db.query(
                                insertVoteSql,
                                [
                                    pollId,
                                    option_id,
                                    resident_id
                                ],
                                (err, result) => {

                                    if (err) {

                                        console.error(
                                            "Error saving vote:",
                                            err
                                        );

                                        return res.status(500).json({

                                            message:
                                                "Failed to save vote"

                                        });
                                    }


                                    res.status(201).json({

                                        message:
                                            "Vote recorded successfully",

                                        vote_id:
                                            result.insertId

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );
};


// ==========================================
// CHECK WHETHER RESIDENT HAS VOTED
// ==========================================

const checkResidentVote = (req, res) => {

    const {
        pollId,
        residentId
    } = req.params;


    const sql = `
        SELECT
            pv.vote_id,
            pv.option_id,
            po.option_text
        FROM poll_votes pv
        JOIN poll_options po
            ON pv.option_id = po.option_id
        WHERE pv.poll_id = ?
        AND pv.resident_id = ?
    `;


    db.query(
        sql,
        [
            pollId,
            residentId
        ],
        (err, results) => {

            if (err) {

                console.error(
                    "Error checking resident vote:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to check resident vote"

                });
            }


            if (results.length === 0) {

                return res.json({

                    hasVoted: false

                });
            }


            res.json({

                hasVoted: true,

                vote: {

                    vote_id:
                        results[0].vote_id,

                    option_id:
                        results[0].option_id,

                    option_text:
                        results[0].option_text

                }

            });

        }
    );
};


// ==========================================
// UPDATE POLL STATUS
// ==========================================

const updatePollStatus = (req, res) => {

    const { id } = req.params;

    const { status } = req.body;


    const allowedStatuses = [

        "Active",

        "Closed"

    ];


    if (
        !allowedStatuses.includes(status)
    ) {

        return res.status(400).json({

            message:
                "Invalid poll status"

        });
    }


    const sql = `
        UPDATE polls

        SET status = ?

        WHERE poll_id = ?
    `;


    db.query(
        sql,
        [status, id],
        (err, result) => {

            if (err) {

                console.error(
                    "Error updating poll status:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to update poll status"

                });
            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({

                    message:
                        "Poll not found"

                });
            }


            res.json({

                message:
                    "Poll status updated successfully"

            });

        }
    );
};


module.exports = {

    getPolls,

    createPoll,

    votePoll,

    checkResidentVote,

    updatePollStatus

};