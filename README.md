**Student Finance Tracker

Theme: Student Finance Tracker – track your expenses, view totals, and manage a simple budget.

*Live site: https://orugamba-ux.github.io/Student-finance-tracker/

Repo: https://github.com/orugamba-ux/student-finance-tracker

*Features

Add/view transactions

Dashboard with totals, top category, and cap warning

Import/export JSON

Regex validation for description, amount, category, date

Keyboard-friendly and responsive

*Regex Examples

Description: /^[A-Za-z0-9\s.,'@#&()-]{3,100}$/

Amount: /^-?\d+(\.\d{1,2})?$/

Category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/

Date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

*Keyboard

Tab → move between fields

Enter → submit form

Ctrl + I → import JSON

Ctrl + E → export JSON

*Accessibility

Labels for all inputs

Semantic HTML (header, main, section, footer)

Visible focus styles

ARIA live for dashboard messages

*How to Run / Test

Open index.html in a browser

Add a transaction (valid description, amount, category, date)

Try invalid inputs to see validation

Refresh → data persists

Import seed.json → check records added

Export → download JSON

*Seed Data

seed.json contains 10 diverse records with edge cases for testing.

*Demo Video

Unlisted YouTube link: https://youtu.be/66VYDQIN73M?si=A1GqL-eJ7GFhliax