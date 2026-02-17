export default function parseBusinessCard(text) {

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const email = lines.find(l => /\S+@\S+\.\S+/.test(l)) || "";

  const phone = lines.find(l =>
    /(\+?\d{1,3}[- ]?)?\d{10}/.test(l.replace(/\s/g,""))
  ) || "";

  let name = "";
  let company = "";

  if (lines.length > 0) name = lines[0];
  if (lines.length > 1) company = lines[1];

  return {
    name,
    company,
    email,
    phone,
  };
}
