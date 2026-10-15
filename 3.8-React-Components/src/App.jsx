import { useState } from "react";
import Autocomplete from "./components/Autocomplete.jsx";
import {
  Alert,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";

export default function App() {
  const [member, setMember] = useState(null);
  const [book, setBook] = useState(null);
  const [bookSearchKey, setBookSearchKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    if (!member || !book) {
      setStatus({
        success: false,
        message: "Search for and select a member and an available book.",
      });
      return;
    }

    setIsSubmitting(true); // just about to call the api - so disable button and inputs as needed
    try {
      const response = await fetch("/api/borrow/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          bookId: book.id,
        }),
      });

      if (!response.ok) {
        throw new Error("The borrow request could not be completed.");
      }

      const result = await response.json();
      setStatus(result);
      if (result.success) {
        setBook(null);
        setBookSearchKey((key) => key + 1);
      }
    } catch (submitError) {
      setStatus({
        success: false,
        message:
          submitError instanceof Error
            ? submitError.message
            : "The borrow request could not be completed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <Card className="booking-page">
        <div className="page-section">
          <h1 className="section-title">Booking</h1>
          <div className="panel">
            <form className="booking-form" onSubmit={handleSubmit}>
              {/* Component made fomr Flowbite-React, components we made ourselves */}
              <Autocomplete
                displayField="name"
                endpoint="/api/members"
                id="member"
                label="Member"
                onSelect={setMember} // passing the setMember function (not calling the function)
                placeholder="Type a member name"
              />
              <Autocomplete
                displayField="title"
                endpoint="/api/books"
                id="book"
                key={bookSearchKey}
                label="Book Title"
                onSelect={setBook}
                placeholder="Type a book title"
              />
              {/* Pre-styled Flowbite-React component - Button */}
              <Button
                color="green"
                disabled={isSubmitting}
                fullSized
                type="submit"
              >
                {isSubmitting ? "Submitting…" : "Check"}
              </Button>
            </form>
          </div>
        </div>

        {/* <div className="page-section">
          <h2 className="section-title">Status</h2>
          <div className="panel">
            {status ? (
              // Pre-styled Flowbite-React component - Alert
              <Alert color={status.success ? "success" : "failure"}>
                {status.message}
              </Alert>
            ) : (
              <Alert color="info">Search for a member and book to begin.</Alert>
            )}
          </div>
        </div> */}
      </Card>

      {/* If status is truthy, then create the Modal, if not, destroy the Modal */}
      {status && (
        <Modal dismissible show={status} onClose={() => setStatus(null)}>
          <ModalHeader>Booking Status</ModalHeader>
          <ModalBody>
            <Alert color={status.success ? "success" : "failure"}>
              {status.message}
            </Alert>
          </ModalBody>
        </Modal>
      )}
    </main>
  );
}
