import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar";
import { getResidentPayments } from "../api/paymentApi";

function ResidentPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentResident = JSON.parse(
    localStorage.getItem("currentResident")
  );

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      if (!currentResident?.residentId) {
        setLoading(false);
        return;
      }

      const data = await getResidentPayments(
        currentResident.residentId
      );

      setPayments(data);

    } catch (error) {
      console.error(
        "Failed to load payments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // PAYMENT CALCULATIONS
  // ==========================================

  const pendingAmount = payments
    .filter(
      (payment) =>
        payment.payment_status === "Pending"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );


  const paidThisYear = payments
    .filter(
      (payment) =>
        payment.payment_status === "Paid"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );


  // ==========================================
  // CURRENT PAYMENT
  // ==========================================

  const currentPayment =
    payments.length > 0
      ? payments[0]
      : null;


  const paymentStatus =
    currentPayment?.payment_status ||
    "Pending";


  // ==========================================
  // FORMAT PAYMENT MONTH
  // ==========================================

  const formatMonth = (paymentMonth) => {

    if (!paymentMonth) {
      return "Not available";
    }

    const date = new Date(paymentMonth);

    if (isNaN(date.getTime())) {
      return paymentMonth;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );
  };


  // ==========================================
  // FORMAT DUE DATE
  // ==========================================

  const formatDueDate = (paymentMonth) => {

    if (!paymentMonth) {
      return "Not available";
    }

    const date = new Date(paymentMonth);

    if (isNaN(date.getTime())) {
      return "Not available";
    }

    date.setDate(10);

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  };


  // ==========================================
  // FORMAT HISTORY MONTH
  // ==========================================

  const formatHistoryMonth = (paymentMonth) => {

    if (!paymentMonth) {
      return "Maintenance";
    }

    const date = new Date(paymentMonth);

    if (isNaN(date.getTime())) {
      return paymentMonth;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );
  };


  return (
    <div className="dashboard-page">

      <ResidentSidebar activePage="payments" />

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <h1>Payments</h1>

            <p>
              View your maintenance payments and payment history.
            </p>
          </div>

        </header>


        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>
              <h3>
                ₹{pendingAmount.toLocaleString("en-IN")}
              </h3>

              <p>Pending Amount</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>
              <h3>
                {currentPayment
                  ? formatDueDate(
                      currentPayment.payment_month
                    )
                  : "No Due Date"}
              </h3>

              <p>Due Date</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <h3>
                ₹{paidThisYear.toLocaleString("en-IN")}
              </h3>

              <p>Paid This Year</p>
            </div>

          </div>

        </section>


        <section className="dashboard-card">

          <div className="card-header">
            <h2>Current Maintenance</h2>
          </div>

          {loading ? (

            <p>Loading payment information...</p>

          ) : (

            <>

              <div className="payment-details">

                <div className="profile-detail">
                  <strong>Maintenance Month</strong>

                  <span>
                    {currentPayment
                      ? formatMonth(
                          currentPayment.payment_month
                        )
                      : "No payment record"}
                  </span>
                </div>


                <div className="profile-detail">
                  <strong>Amount</strong>

                  <span>
                    {currentPayment
                      ? `₹${Number(
                          currentPayment.amount
                        ).toLocaleString("en-IN")}`
                      : "₹0"}
                  </span>
                </div>


                <div className="profile-detail">
                  <strong>Due Date</strong>

                  <span>
                    {currentPayment
                      ? formatDueDate(
                          currentPayment.payment_month
                        )
                      : "Not available"}
                  </span>
                </div>


                <div className="profile-detail">
                  <strong>Status</strong>

                  <span>
                    {paymentStatus}
                  </span>
                </div>

              </div>


              {currentPayment?.payment_status !==
                "Paid" && (

                <button
                  className="auth-button"
                  onClick={() =>
                    navigate(
                      "/resident-payment-checkout"
                    )
                  }
                >
                  💳 Pay Maintenance
                </button>

              )}

            </>

          )}

        </section>


        <section className="dashboard-card activity-card">

          <div className="card-header">
            <h2>Payment History</h2>
          </div>


          {loading ? (

            <p>Loading payment history...</p>

          ) : payments.length === 0 ? (

            <p>No payment history available.</p>

          ) : (

            payments.map((payment) => (

              <div
                className="activity-item"
                key={payment.payment_id}
              >

                <span>
                  {payment.payment_status === "Paid"
                    ? "✅"
                    : "⏳"}
                </span>


                <div>

                  <strong>
                    {formatHistoryMonth(
                      payment.payment_month
                    )}{" "}
                    Maintenance
                  </strong>

                  <p>
                    Payment of ₹
                    {Number(
                      payment.amount
                    ).toLocaleString("en-IN")}{" "}
                    {payment.payment_status ===
                    "Paid"
                      ? "completed."
                      : "is pending."}
                  </p>

                </div>


                <small>
                  {payment.payment_status}
                </small>

              </div>

            ))

          )}

        </section>

      </main>

    </div>
  );
}

export default ResidentPayments;