# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2024-12-07

### Added
- **Multi-Calendar Support**: Full support for Jalali, Gregorian, Hijri, and Chinese calendars
- **Multiple Selection Modes**: Single date, date range, and multiple dates selection
- **Time Picker**: Optional time selection with 12/24-hour format support
- **Dynamic Year Ranges**: `yearsBefore` and `yearsAfter` props for flexible year constraints
- **Locale Switching**: Built-in locale selector with dynamic calendar switching
- **CSS Variables**: 70+ CSS custom properties for complete theme customization
- **SCSS Mixins**: Reusable SCSS mixins for custom styling (`datepicker-grid`, `custom-scrollbar`, etc.)
- **Universal Date Validation**: `isValidDate()`, `isValidJalaaliDate()`, `isValidGregorianDate()` functions
- **Enhanced Date Parsing**: `parseDate()` function supporting all calendar types
- **Number Localization**: Automatic number formatting based on calendar type

### Changed
- **Improved Validation**: Enhanced date validation for all supported calendars
- **Better i18n**: Improved internationalization with proper RTL/LTR support
- **Optimized Bundle**: Tree-shakeable exports and reduced bundle size
- **Package Exports**: Added SCSS source files to package exports for customization

### Fixed
- Fixed "Today" text not showing in Gregorian and Chinese calendars
- Fixed scrollbar styling inconsistencies
- Fixed calendar day updates between months
- Fixed 6-row calendar display issue
- Fixed year constraints validation
- Fixed auto-scroll functionality in year selector
- Fixed range selection gradient positioning

### Documentation
- Comprehensive README with usage examples
- API reference documentation
- Customization guide with CSS variables and SCSS mixins
- Migration guide from previous versions

## [0.1.3] - Previous Release

### Added
- Basic Jalali calendar support
- Single date selection
- Month and year navigation
- Today marker
- Min/max date constraints
- Custom input integration
- Initial value support

---

## Future Plans

### Upcoming Features
- Week picker mode
- Quarter picker mode
- Year picker mode
- Keyboard shortcuts
- Custom cell rendering
- Disabled dates function
- Highlighted dates
- Custom icons support
- Dark mode theme
- More locale support

### Performance Improvements
- Virtual scrolling for year list
- Memoization optimizations
- Lazy loading for calendar views

---

For more details about each release, please see the [GitHub Releases](https://github.com/yourusername/vue-datepicker/releases) page.
