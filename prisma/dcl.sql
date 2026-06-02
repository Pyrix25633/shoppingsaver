-- ! Modify .env to use root user when executing the 'npx prisma db push' command

CREATE USER 'shoppingsaver'@'localhost' IDENTIFIED BY '<password>';

GRANT SELECT, INSERT, DELETE ON TempUser TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON User TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Category TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Brand TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Supermarket TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Product TO 'shoppingsaver'@'localhost';