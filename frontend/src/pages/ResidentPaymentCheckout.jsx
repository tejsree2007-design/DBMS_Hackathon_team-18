import { useNavigate } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar";
import { useEffect, useState } from "react";
import {
  getResidentPayments,
  markPaymentAsPaid
} from "../api/paymentApi";

function ResidentPaymentCheckout() {
  const navigate = useNavigate();

  const [currentResident] = useState(() =>
    JSON.parse(localStorage.getItem("currentResident"))
  );

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const loadPayment = async () => {

      if (!currentResident?.residentId) {
        setLoading(false);
        return;
      }

      try {

        const payments = await getResidentPayments(
          currentResident.residentId
        );

        const pendingPayment = payments.find(
          (item) =>
            item.payment_status === "Pending"
        );

        setPayment(pendingPayment || null);

      } catch (error) {

        console.error(
          "Error loading payment:",
          error
        );

        alert(
          "Failed to load payment information."
        );

      } finally {
        setLoading(false);
      }
    };

    loadPayment();

  }, [currentResident]);


  const handlePayment = async () => {

    if (!currentResident) {
      alert("Resident information not found.");
      return;
    }

    if (!payment) {
      alert("No pending payment found.");
      return;
    }

    try {

      setPaying(true);

      await markPaymentAsPaid(
        payment.payment_id
      );

      alert("Demo payment successful!");

      navigate("/resident-payments");

    } catch (error) {

      console.error(
        "Payment error:",
        error
      );

      alert(
        error.message ||
        "Payment failed."
      );

    } finally {
      setPaying(false);
    }
  };


  return (
    <div className="dashboard-page">

      <ResidentSidebar activePage="payments" />

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <h1>Maintenance Payment</h1>

            <p>
              Complete your maintenance payment.
            </p>
          </div>

        </header>


        <section className="dashboard-card">

          <div className="card-header">
            <h2>Payment Details</h2>
          </div>


          {loading ? (

            <p>Loading payment details...</p>

          ) : !payment ? (

            <p>
              No pending payment found.
            </p>

          ) : (

            <>

              <div className="payment-details">

                <div className="profile-detail">
                  <strong>Maintenance Month</strong>

                  <span>
                    {payment.payment_month}
                  </span>
                </div>


                <div className="profile-detail">
                  <strong>Flat Number</strong>

                  <span>
                    {payment.flat_number ||
                      currentResident?.flatNumber ||
                      "Not available"}
                  </span>
                </div>


                <div className="profile-detail">
                  <strong>Amount</strong>

                  <span>
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </span>
                </div>


                <div className="profile-detail">
                  <strong>Due Date</strong>

                  <span>
                    10 September 2026
                  </span>
                </div>

              </div>


              <button
                className="auth-button"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying
                  ? "Processing..."
                  : `💳 Pay ₹${Number(
                      payment.amount
                    ).toLocaleString("en-IN")}`}
              </button>

            </>

          )}


          <button
            className="back-button"
            onClick={() =>
              navigate("/resident-payments")
            }
          >
            ← Back to Payments
          </button>

        </section>

      </main>

    </div>
  );
}

export default ResidentPaymentCheckout;