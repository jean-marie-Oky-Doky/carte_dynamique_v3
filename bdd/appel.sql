-- Création de la base de données
CREATE DATABASE IF NOT EXISTS Appel;
USE Appel;

-- Création de la table
CREATE TABLE Liste_appel (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    adresse VARCHAR(255) NOT NULL,
    gravite ENUM('Cardiaque', 'Blessure', 'Pédiatrique', 'Brulure', 'Enceinte') NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5)
);

ALTER TABLE Liste_appel
ADD latitude DECIMAL(10,8),
ADD longitude DECIMAL(11,8);


-- Insertion des données
INSERT INTO Liste_appel (adresse, gravite, score) VALUES
('12 rue Chartraine, 27000 Évreux', 'Cardiaque', 5),
('8 rue Saint-Germain, 27200 Vernon', 'Blessure', 3),
('25 avenue des Peupliers, 27400 Louviers', 'Pédiatrique', 4),
('3 rue Marcel Lefèvre, 27190 Conches-en-Ouche', 'Brulure', 2),
('18 rue Aristide Briand, 27140 Gisors', 'Enceinte', 4),
('6 place Dupont de l’Eure, 27110 Le Neubourg', 'Cardiaque', 5),
('14 rue Grande, 27300 Bernay', 'Blessure', 2),
('22 rue du Général de Gaulle, 27600 Gaillon', 'Pédiatrique', 3),
('5 rue de la République, 27500 Pont-Audemer', 'Brulure', 1),
('9 rue Victor Hugo, 27130 Verneuil-sur-Avre', 'Enceinte', 3);
