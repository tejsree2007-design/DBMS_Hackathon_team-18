import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getPayments } from "../api/paymentApi";
import { getResidents } from "../api/residentApi";

function AdminPayments() {

  const [payments, setPayments] = useState([]);

  const [residents, setResidents] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    resident_id: "",
    amount: "2500",
    payment_month: new Date()
      .toISOString()
      .slice(0, 7) + "-01"
  });


  // ==========================================
  // LOAD PAYMENTS AND RESIDENTS
  // ==========================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        setError("");

        const [paymentData, residentData] =
          await Promise.all([
            getPayments(),
            getResidents()
          ]);

        setPayments(paymentData);

        setResidents(residentData);

      } catch (error) {

        console.error(
          "Error loading payment data:",
          error
        );

        setError(
          "Failed to load payment information from the server."
        );

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, []);


  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleFormChange = (e) => {

    const { name, value } = e.target;

    setPaymentForm((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // ==========================================
  // CREATE PAYMENT
  // ==========================================

  const handleCreatePayment = async (e) => {

    e.preventDefault();

    if (!paymentForm.resident_id) {

      alert("Please select a resident.");

      return;

    }

    if (
      !paymentForm.amount ||
      Number(paymentForm.amount) <= 0
    ) {

      alert("Please enter a valid amount.");

      return;

    }

    if (!paymentForm.payment_month) {

      alert("Please select a payment month.");

      return;

    }

    try {

      setCreating(true);

      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            resident_id:
              Number(paymentForm.resident_id),

            amount:
              Number(paymentForm.amount),

            payment_month:
              paymentForm.payment_month
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to create payment"
        );

      }

      alert("Payment created successfully!");

      // Reload payments from backend
      const updatedPayments =
        await getPayments();

      setPayments(updatedPayments);

      // Reset form
      setPaymentForm({
        resident_id: "",
        amount: "2500",
        payment_month:
          new Date()
            .toISOString()
            .slice(0, 7) + "-01"
      });

    } catch (error) {

      console.error(
        "Error creating payment:",
        error
      );

      alert(
        error.message ||
        "Failed to create payment."
      );

    } finally {

      setCreating(false);

    }

  };


  // ==========================================
  // SEARCH PAYMENTS
  // ==========================================

  const filteredPayments = payments.filter(
    (payment) => {

      const name =
        payment.name || "";

      const flat =
        payment.flat_number || "";

      const month =
        payment.payment_month
          ? payment.payment_month.toString()
          : "";

      return (
        name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        flat
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        month
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }
  );


  // ==========================================
  // COUNT PAID PAYMENTS
  // ==========================================

  const paidCount = payments.filter(
    (payment) =>
      payment.payment_status === "Paid"
  ).length;


  // ==========================================
  // COUNT PENDING PAYMENTS
  // ==========================================

  const pendingCount = payments.filter(
    (payment) =>
      payment.payment_status === "Pending"
  ).length;


  // ==========================================
  // CALCULATE PENDING AMOUNT
  // ==========================================

  const totalPendingAmount = payments
    .filter(
      (payment) =>
        payment.payment_status === "Pending"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );


  // ==========================================
  // FORMAT PAYMENT MONTH
  // ==========================================

  const formatMonth = (date) => {

    if (!date) {
      return "-";
    }

    const paymentDate =
      new Date(date);

    return paymentDate.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );

  };


  // ==========================================
  // FORMAT PAID DATE
  // ==========================================

  const formatPaidDate = (date) => {

    if (!date) {
      return "-";
    }

    const paidDate =
      new Date(date);

    return paidDate.toLocaleDateString(
      "en-IN"
    );

  };


  // ==========================================
  // CURRENT MONTH
  // ==========================================

  const currentMonth =
    new Date().toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );


  return (

    <div className="dashboard-page">

      <AdminSidebar
        activePage="payments"
      />


      <main className="dashboard-main">


        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="dashboard-header">

          <div>

            <h1>
              Payments
            </h1>

            <p>
              Manage resident maintenance payments.
            </p>

          </div>

        </header>


        {/* ==========================================
            PAYMENT STATISTICS
        ========================================== */}

        <section className="dashboard-stats">


          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>

              <h3>
                ₹
                {totalPendingAmount.toLocaleString(
                  "en-IN"
                )}
              </h3>

              <p>
                Pending Amount
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <h3>
                {pendingCount}
              </h3>

              <p>
                Pending Payments
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <h3>
                {paidCount}
              </h3>

              <p>
                Paid Payments
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <h3>
                {currentMonth}
              </h3>

              <p>
                Current Month
              </p>

            </div>

          </div>

        </section>


        {/* ==========================================
            CREATE PAYMENT
        ========================================== */}

        <section className="dashboard-card">

          <div className="card-header">

            <h2>
              Create Maintenance Payment
            </h2>

          </div>


          <form
            onSubmit={handleCreatePayment}
          >

            <div className="payment-details">


              {/* Resident */}

              <div className="profile-detail">

                <strong>
                  Resident
                </strong>

                <select
                  name="resident_id"
                  value={
                    paymentForm.resident_id
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                >

                  <option value="">
                    Select Resident
                  </option>

                  {residents.map(
                    (resident) => (

                      <option
                        key={
                          resident.resident_id
                        }
                        value={
                          resident.resident_id
                        }
                      >
                        {resident.name}
                        {" - "}
                        Flat{" "}
                        {resident.flat_number}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Amount */}

              <div className="profile-detail">

                <strong>
                  Amount
                </strong>

                <input
                  type="number"
                  name="amount"
                  value={
                    paymentForm.amount
                  }
                  onChange={
                    handleFormChange
                  }
                  min="1"
                  required
                />

              </div>


              {/* Month */}

              <div className="profile-detail">

                <strong>
                  Payment Month
                </strong>

                <input
                  type="date"
                  name="payment_month"
                  value={
                    paymentForm.payment_month
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                />

              </div>


            </div>


            <button
              type="submit"
              className="auth-button"
              disabled={creating}
            >

              {creating
                ? "Creating Payment..."
                : "➕ Create Payment"}

            </button>

          </form>

        </section>


        {/* ==========================================
            RESIDENT PAYMENTS
        ========================================== */}

        <section className="dashboard-card admin-payments-card">


          <div className="card-header">

            <h2>
              Resident Payments
            </h2>

          </div>


          {/* Search */}

          <div className="admin-payment-search">

            <label>
              Search Residents
            </label>

            <input
              type="text"
              placeholder="Search by name, flat number or month"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Error */}

          {error && (

            <p className="admin-error">
              {error}
            </p>

          )}


          {/* Payment Table */}

          <div className="admin-payment-table-container">

            <table className="admin-payment-table">

              <thead>

                <tr>

                  <th>
                    Resident
                  </th>

                  <th>
                    Flat Number
                  </th>

                  <th>
                    Month
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Paid Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="admin-payment-empty"
                    >
                      Loading payments...
                    </td>

                  </tr>

                ) : filteredPayments.length > 0 ? (

                  filteredPayments.map(
                    (payment) => (

                      <tr
                        key={
                          payment.payment_id
                        }
                      >

                        <td>

                          <strong>
                            {payment.name}
                          </strong>

                        </td>


                        <td>
                          {payment.flat_number}
                        </td>


                        <td>
                          {formatMonth(
                            payment.payment_month
                          )}
                        </td>


                        <td>

                          ₹
                          {Number(
                            payment.amount
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        <td>

                          <span
                            className={`payment-status ${
                              payment.payment_status.toLowerCase()
                            }`}
                          >

                            {
                              payment.payment_status
                            }

                          </span>

                        </td>


                        <td>

                          {formatPaidDate(
                            payment.paid_at
                          )}

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="admin-payment-empty"
                    >

                      No payment records found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>

  );

}

export default AdminPayments;