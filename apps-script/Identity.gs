/** Hanya Gmail pribadi yang mengabaikan titik; domain perusahaan tetap persis. */
function canonicalAccount_(value) {
  const email = String(value || '').trim().toLowerCase();
  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1] || /\s/.test(email)) return '';
  if (parts[1] === 'gmail.com' && /^[a-z0-9]+(?:\.[a-z0-9]+)*$/.test(parts[0])) return parts[0].replace(/\./g, '') + '@gmail.com';
  return email;
}
