# Tunisian Committers

> Real-time leaderboard showcasing Tunisia's top GitHub contributors

## Features

- **Real-time Data**: Fetches contributor data directly from committers.top
- **Top 5 Podium**: Beautiful podium showcasing the top 5 contributors with gold/silver/bronze styling
- **Complete Leaderboard**: Searchable, sortable table with pagination
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean dark theme with smooth animations and SVG icons
- **Zero Dependencies**: Pure vanilla JavaScript, no frameworks required

## Project Structure

```
tunisiancommitters.online/
├── index.html       # Main HTML file
├── css/
│   └── styles.css   # All styling
├── js/
│   └── app.js       # Application logic
└── README.md        # Documentation
```

## How to Use

### Local Development

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open http://localhost:8000
```

### Deployment

Deploy to any static hosting service:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag and drop the folder
- **Vercel**: `vercel deploy`
- **Any web server**: Upload all files

## How It Works

1. **Data Fetching**: Scrapes contributor data from committers.top/tunisia
2. **Podium Display**: Shows top 5 contributors with special styling
3. **Table View**: Displays all contributors with search and sort functionality
4. **Auto-includes**: Adds boussaid001 profile if not already in the list

## Customization

### Update Styling

Edit `css/styles.css` to customize:
- Color scheme (CSS variables in `:root`)
- Layout and spacing
- Animations and transitions

### Modify Data Source

Edit `js/app.js` function `fetchContributorsData()` to change data source.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT License

## Credits

- Data sourced from [committers.top](https://committers.top/tunisia)
- Icons: SVG stroke icons
- Built with vanilla HTML, CSS, and JavaScript

---

**Made with ❤️ for the Tunisian tech community**
