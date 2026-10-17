Rao Brothers ISP — Persistent Auth + Database Reliability Package

इस ZIP में सुधार किए गए हैं, लेकिन इसे live production-ready प्रमाणपत्र न समझें। Live GoDaddy वेबसाइट/database को यहाँ से access या modify नहीं किया गया।

इस build में:
1. Login rate limiting अब MySQL table `rao_login_attempts` में है, इसलिए single-server restart के बाद attempts/lockout बने रहते हैं। IP address को raw रूप में save नहीं किया जाता; SHA-256 hash store होता है। Limit: 15 मिनट की window में 8 failed attempts, फिर 15 मिनट lockout।
2. Session tokens अब HMAC-SHA256 signed, 12 घंटे expiry वाले stateless tokens हैं। Signing key MySQL table `rao_auth_config` में रखी जाती है, इसलिए server restart के बाद sessions verify हो सकते हैं। Secret table server startup पर initialize होता है।
3. Session signatures constant-time comparison से verify होते हैं। Invalid/expired token reject होता है।
4. Manual backup endpoint अब backup row को दोबारा पढ़कर JSON payload और basic counts verify करता है; failure पर success response नहीं देता। Daily backup errors अब function के caller तक propagate होते हैं।
5. Main data transaction commit हो जाने के बाद daily backup fail हो तो server log में अलग warning आती है—committed DB write को गलत तरीके से failed नहीं बताया जाता।
6. `npm run check` static security/persistence smoke checks चलाता है।
7. `npm run test:mysql` MySQL connection, auth/backup schema, saved backup JSON और अलग disposable table पर transaction rollback check करता है। यह customer/business tables को modify नहीं करता।

GoDaddy पर जरूरी setup:
- Environment variables: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD; DB_PORT optional (default 3306).
- पहले backup लें और test/staging database पर deploy करें। Server startup DB में `rao_auth_config` और `rao_login_attempts` tables बनाएगा। Database user को required CREATE TABLE/SELECT/INSERT/UPDATE/DELETE permissions चाहिए।
- `npm install`, फिर `npm run check` चलाएँ। Server successfully start होने और schema initialization के बाद `npm run test:mysql` चलाएँ। इस package में कोई database password शामिल नहीं है।
- Admin login के बाद `/api/admin/backup-now` endpoint call करने पर response में “Backup saved and verified” आना चाहिए।

सीमाएँ:
- इस environment में GoDaddy MySQL credentials नहीं हैं, इसलिए real DB integration test run नहीं हुआ। `npm run test:mysql` को hosting के configured environment में चलाना होगा।
- Rollback integration test केवल isolated disposable table पर MySQL transaction semantics जाँचता है; यह production data पर restore test नहीं है।
- Restore को live data पर स्वतः चलाने वाला endpoint नहीं जोड़ा गया, क्योंकि गलत तारीख/अनजाने click से customer/payment data overwrite होने का जोखिम है। Backup payload validate होता है, लेकिन full restore drill अलग staging database पर करनी होगी।
- Signed session tokens 12 घंटे तक valid रहते हैं और इस version में individual token revocation/logout denylist नहीं है। Password बदलने के बाद भी पहले جاری کیا गया token expiry तक valid रह सकता है; production में revocable server-side sessions की जरूरत है।
- Login rate limit single MySQL database पर shared है; proxy/network architecture के हिसाब से IP handling और per-account limits का अलग security review जरूरी है।
- Persistence अभी कई business tables को एक transaction में delete/reinsert करती है। यह existing app schema के साथ staging test किए बिना production में overwrite नहीं करनी चाहिए।
- ZIP को live package के ऊपर सीधे overwrite न करें। पहले files + database backup लें और staging में customer add, login, payment, complaint, restore drills test करें।
