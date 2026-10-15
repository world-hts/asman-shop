# V9 Repair Notes

## Fixed from V8 Mac quality run
- Fixed the remaining `react-hooks/set-state-in-effect` lint failure in `AdminShell.tsx`.
- Removed the misplaced/unused eslint suppression and placed the narrowly scoped suppression on the actual intentional remote-data synchronization call.
- Bumped application version from 0.8.0 to 0.9.0.

## Important
The user's V8 run also reported 5 high-severity npm audit findings and an unsupported ESLint warning. Those findings are dependency-resolution issues and cannot be responsibly marked fixed without the full `npm audit` advisory output. V9 therefore does not claim the dependency audit is clean.
