# LifeTrack

> Your personal command center — keep your tasks, belongings, and financial responsibilities organized in one place.

![Tech](https://img.shields.io/badge/stack-React%20%2F%20Next.js-7c3aed?style=flat-square)

---

## ✨ About

LifeTrack is a personal workspace app that helps you stay on top of three areas of everyday life:

- 📝 **Tasks** — turn your plans into progress
- 📦 **Storage** — remember where you put everything
- 💳 **Payments** — track what you owe and what you're owed

Everything is unified under a single **Dashboard** that gives you an at-a-glance overview of your activity, upcoming deadlines, and outstanding balances.

---

## 🚀 Features

### 📊 Dashboard

- Welcome banner with a personal overview
- Summary cards: total tasks, stored items, pending payments, task completion %
- **Financial overview** — total money owed vs. total to receive
- **Upcoming tasks** and **important items** at a glance
- **Recent payments** feed with amounts and status
- **Quick actions** to add a task, save an item, or add a payment

### 📝 Things to Do

- Create, edit, and delete tasks
- Set priority levels (High / Medium / Low)
- Track status: **To do → In progress → Completed** (with reopen support)
- Set due dates
- Search and filter by status
- Statistics cards: total, to-do, in-progress, completed

### 📦 Storage

- Log items with **name, category, location, and notes**
- Categories: Electronics, Documents, Clothing, Accessories, Household, Other
- Mark items as **⭐ Important** for quick access
- Search items, locations, and notes
- Filter by category or "Important only"
- Statistics cards: total items, important, categories, locations

### 💳 Payments

- Track **owed** and **to-receive** payments
- Set due dates and status: Pending, Overdue, Completed
- Mark payments as paid, edit, or delete
- Search and filter by status
- Summary cards: pending total, overdue total, payment history

---

## 🛠️ Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Framework | React / Next.js                      |
| Styling   | Tailwind CSS                         |
| Icons     | Lucide                               |
| Fonts     | Sans-serif (Inter-style)             |
| Data      | Local storage / API (custom backend) |

---

## 📁 Project Structure

```
lifetrack/
├── app/                    # App routes (or pages/)
│   ├── dashboard/          # Overview / command center
│   ├── tasks/              # Things to do
│   ├── storage/            # My storage
│   └── payments/           # Payments
├── components/             # Reusable UI components
│   ├── layout/             # Sidebar, navbar
│   ├── cards/              # Summary cards, item cards
│   └── modals/             # Add/edit dialogs
├── lib/                    # Utilities & helpers
├── public/                 # Static assets
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lifetrack.git
cd lifetrack

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## 🎨 Design System

- **Primary color:** Purple (`#7c3aed`) with gradient accents
- **Accent colors:** Green (paid/success), amber (overdue/warning), red (delete/danger)
- **Corner radius:** Rounded cards with soft shadows
- **Typography:** Bold headings, muted supporting text
- **Layout:** Collapsible sidebar + responsive content grid

---

## 🗺️ Roadmap

- [ ] User authentication & multi-workspace support
- [ ] Dark mode
- [ ] Notifications & reminders for overdue payments/tasks
- [ ] Recurring payments
- [ ] Export data (CSV / PDF)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Built with 💜 by **[Your Name]**

> "Stay organized. Small steps, big progress."
