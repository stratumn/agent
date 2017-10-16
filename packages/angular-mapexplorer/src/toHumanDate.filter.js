export default function filter(timestamp) {
  if (timestamp) {
    const dateParts = timestamp.match(
      /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
    );
    dateParts[2] -= 1; // months are zero-based
    return new Date(Date.UTC.apply(this, dateParts.slice(1))).toISOString();
  }
  return '';
}
