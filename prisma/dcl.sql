-- ! Modify .env to use root user when executing the 'npx prisma db push' command

CREATE USER 'shoppingsaver'@'localhost' IDENTIFIED BY 'shoppingsaver@Mini25633';

GRANT SELECT, INSERT, DELETE ON TempUser TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON User TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Location TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Product TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Stock TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Category TO 'shoppingsaver'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Book TO 'shoppingsaver'@'localhost';