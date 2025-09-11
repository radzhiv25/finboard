# 📊 FinBoard Reports Setup Guide

## Overview
This guide will help you set up the comprehensive reporting system for FinBoard with beautiful charts and analytics.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install recharts
```

### 2. Set Up Appwrite Database
```bash
npm run setup-db
```

This will create:
- **Database**: `finboard-db`
- **Collections**: `users`, `transactions`, `reports`, `goals`, `categories`
- **Indexes**: Optimized for fast queries
- **Default Categories**: Pre-populated with common financial categories

### 3. Environment Variables
Make sure your `.env` file has:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
VITE_APPWRITE_COLLECTION_GOALS=goals
VITE_APPWRITE_COLLECTION_REPORTS=reports
VITE_APPWRITE_COLLECTION_CATEGORIES=categories
```

## 📈 Reports Features

### 1. **Interactive Charts**
- **Pie Chart**: Category breakdown with percentages
- **Area Chart**: Income vs Expenses over time
- **Bar Chart**: Monthly financial performance
- **Line Chart**: Weekly trends with net worth

### 2. **Data Visualizations**
- **Category Analysis**: Detailed spending breakdown
- **Time-based Views**: Monthly and weekly data
- **Financial Trends**: Income, expenses, and net worth
- **Interactive Filters**: Time range and category filtering

### 3. **Chart Types Available**
- **Pie Charts**: For category distribution
- **Area Charts**: For stacked financial data
- **Bar Charts**: For comparative analysis
- **Line Charts**: For trend analysis

## 🛠️ Database Schema

### Collections Created:

#### 1. **Users Collection**
```json
{
  "name": "string (255)",
  "email": "string (255)",
  "avatar": "string (500)",
  "preferences": "string (2000)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### 2. **Transactions Collection**
```json
{
  "userId": "string (255)",
  "title": "string (255)",
  "description": "string (1000)",
  "amount": "double",
  "currency": "string (10)",
  "category": "string (100)",
  "subcategory": "string (100)",
  "tags": "string (500)",
  "date": "datetime",
  "isRecurring": "boolean",
  "recurringFrequency": "string (50)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### 3. **Reports Collection** (Caching)
```json
{
  "userId": "string (255)",
  "reportType": "string (100)",
  "timeRange": "string (50)",
  "data": "string (10000)",
  "generatedAt": "datetime",
  "expiresAt": "datetime"
}
```

#### 4. **Goals Collection**
```json
{
  "userId": "string (255)",
  "title": "string (255)",
  "description": "string (1000)",
  "targetAmount": "double",
  "currentAmount": "double",
  "currency": "string (10)",
  "targetDate": "datetime",
  "category": "string (100)",
  "status": "string (50)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### 5. **Categories Collection**
```json
{
  "name": "string (100)",
  "type": "string (50)",
  "color": "string (20)",
  "icon": "string (50)",
  "isDefault": "boolean",
  "isActive": "boolean",
  "createdAt": "datetime"
}
```

## 🎨 Chart Customization

### Color Schemes
The charts use a predefined color palette:
```javascript
const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#0000ff'
];
```

### Chart Types Available
1. **PieChart**: Category breakdown
2. **AreaChart**: Stacked financial data
3. **BarChart**: Comparative analysis
4. **LineChart**: Trend analysis

## 🔧 Advanced Configuration

### 1. **Custom Chart Colors**
Edit the `COLORS` array in `Reports.tsx`:
```javascript
const COLORS = [
    '#your-color-1', '#your-color-2', // Add your colors
];
```

### 2. **Time Range Options**
Modify the time range selector:
```javascript
<SelectItem value="1month">Last Month</SelectItem>
<SelectItem value="3months">Last 3 Months</SelectItem>
<SelectItem value="6months">Last 6 Months</SelectItem>
<SelectItem value="1year">Last Year</SelectItem>
```

### 3. **Chart Dimensions**
Adjust chart height in the component:
```javascript
<div className="h-80"> {/* Change h-80 to your preferred height */}
```

## 📊 Report Types

### 1. **Category Breakdown**
- Pie chart showing spending distribution
- Percentage and absolute values
- Color-coded categories

### 2. **Financial Trends**
- Area chart with income vs expenses
- Stacked visualization
- Time-based analysis

### 3. **Performance Analysis**
- Bar chart for monthly comparison
- Line chart for weekly trends
- Net worth tracking

### 4. **Detailed Analysis**
- Category-wise breakdown
- Transaction counts
- Progress bars

## 🚀 Usage

### 1. **Access Reports**
Navigate to `/reports` in your application

### 2. **Filter Data**
- Use time range selector
- Filter by category
- Switch between monthly/weekly views

### 3. **Export Data**
- Click the "Export" button (future feature)
- Download as PDF or CSV

## 🔍 Troubleshooting

### Common Issues:

#### 1. **Charts Not Loading**
- Check if recharts is installed: `npm list recharts`
- Verify data is being fetched correctly
- Check browser console for errors

#### 2. **Database Connection Issues**
- Verify Appwrite credentials
- Check if collections exist
- Run `npm run setup-db` again

#### 3. **Performance Issues**
- Reports are cached for better performance
- Large datasets may take time to load
- Consider pagination for very large datasets

## 🎯 Future Enhancements

### Planned Features:
1. **Export Functionality**: PDF and CSV export
2. **Advanced Filters**: Date range, amount range
3. **Custom Reports**: User-defined report types
4. **Real-time Updates**: Live data refresh
5. **Mobile Optimization**: Touch-friendly charts
6. **Print Support**: Print-friendly layouts

## 📝 Notes

- Charts are responsive and work on all screen sizes
- Data is automatically cached for better performance
- All charts support tooltips and legends
- Color schemes are consistent across all visualizations
- Time-based data is automatically sorted chronologically

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Appwrite setup
3. Ensure all dependencies are installed
4. Check the troubleshooting section above

---

**Happy Reporting! 📊✨**

