import { jsPDF } from "jspdf";

export type InvoiceBooking = {
  _id?: string;
  id?: string;
  studioName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: string;
};

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


export function downloadInvoice(
  booking: InvoiceBooking,
  user: { name: string; email: string }
): void {
  const doc = new jsPDF();
  const bookingId = booking._id ?? booking.id ?? "N/A";
  const issuedOn = formatDate(new Date().toISOString());
  const total = Number(booking.price) || 0;
  const tax = Math.round(total * 0.05 * 100) / 100; // 5% service charge
  const grandTotal = Math.round((total + tax) * 100) / 100;

  // Accent header band
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 26, "F");

  doc.setTextColor(11, 17, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("StudioSpace", 14, 17);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Invoice", 196, 17, { align: "right" });

  // Meta block
  let y = 40;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text("INVOICE ID", 14, y);
  doc.text("DATE ISSUED", 110, y);
  y += 6;
  doc.setTextColor(11, 17, 32);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(String(bookingId).slice(-8).toUpperCase(), 14, y);
  doc.text(issuedOn, 110, y);

  y += 12;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text("BILLED TO", 14, y);
  y += 6;
  doc.setTextColor(11, 17, 32);
  doc.setFontSize(11);
  doc.text(user.name, 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(user.email, 14, y + 6);

  // Divider
  y += 18;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.4);
  doc.line(14, y, 196, y);

  // Booking details
  y += 12;
  doc.setTextColor(11, 17, 32);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Booking Details", 14, y);

  const rows: Array<[string, string]> = [
    ["Studio", booking.studioName],
    ["Date", formatDate(booking.date)],
    ["Time slot", booking.timeSlot],
    ["Status", booking.status],
  ];

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  for (const [label, value] of rows) {
    doc.setTextColor(100, 116, 139);
    doc.text(label, 14, y);
    doc.setTextColor(11, 17, 32);
    doc.setFont("helvetica", "bold");
    doc.text(value, 70, y);
    doc.setFont("helvetica", "normal");
    y += 8;
  }

  // Divider
  y += 4;
  doc.setDrawColor(51, 65, 85);
  doc.line(14, y, 196, y);

  // Amounts
  y += 12;
  doc.setFontSize(11);
  const amounts: Array<[string, string, boolean]> = [
    ["Studio fee", `\u09F3 ${total.toFixed(2)}`, false],
    ["Service charge (5%)", `\u09F3 ${tax.toFixed(2)}`, false],
    ["Total due", `\u09F3 ${grandTotal.toFixed(2)}`, true],
  ];
  for (const [label, value, strong] of amounts) {
    doc.setFont("helvetica", strong ? "bold" : "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(label, 110, y);
    doc.setTextColor(11, 17, 32);
    doc.text(value, 196, y, { align: "right" });
    y += 8;
  }

  // Footer
  y += 14;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Thank you for booking with StudioSpace. This is a computer-generated invoice.",
    105,
    y,
    { align: "center" }
  );

  doc.save(`StudioSpace-Invoice-${String(bookingId).slice(-8)}.pdf`);
}
