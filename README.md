# ♟️ Chess

A fully functional **two-player chess game** built from scratch using vanilla **JavaScript, HTML, and CSS** — no libraries, no frameworks, just pure front-end code.

## 🎮 Live Demo

> Open `index.html` in any browser to play instantly — no installation required.

---

## ✨ Features

- ♟️ Complete two-player chess on a single device
- ✅ Full implementation of all chess piece movement rules
  - Pawn (including first-move double advance)
  - Rook, Bishop, Queen, King, Knight
- 🔄 Turn-based gameplay with automatic player switching
- 🎯 Move highlighting — see valid moves before you commit
- 👑 Check and checkmate detection
- 🎨 Clean, responsive board design

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| **JavaScript** | Game logic, piece movement rules, turn management, state |
| **HTML** | Board structure and UI layout |
| **CSS** | Board styling, piece visuals, move highlighting |

---

## 📁 File Structure

```
Chess/
├── index.html      # Game board structure and UI
├── app.js          # Core game logic and state management
├── pieces.js       # Piece definitions and movement rules
└── styles.css      # Board and piece styling
```

---

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/DLaszlo2003/Chess-Project.git
```
2. Open `index.html` in your browser — that's it, no setup needed.

---

## 🧠 Implementation Details

The game logic is split across two JavaScript files:

- **`app.js`** manages the overall game state: the board, whose turn it is, selected pieces, and detecting check/checkmate conditions.
- **`pieces.js`** defines each piece type and encodes its legal movement rules, used by the main logic to validate and highlight moves.

---

## 👤 Author

**Dezső László** — [LinkedIn](https://www.linkedin.com/in/lászló-dezső-39a676255/) · [GitHub](https://github.com/DLaszlo2003)
