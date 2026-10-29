<?php

$host = 'localhost';
$port = '3306';
$user = 'root';
$pass = 'mysql';
$dbname = 'mario_jump';

try {

    $pdo = new PDO(
        "mysql:host=$host;port=$port;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    $pdo->exec(
        "CREATE DATABASE IF NOT EXISTS `$dbname`"
    );

    $pdo->exec(
        "USE `$dbname`"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS ranking (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50) NOT NULL,
            personagem VARCHAR(20) NOT NULL DEFAULT 'monica',
            pontos INT NOT NULL DEFAULT 0,
            data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )"
    );

    // Se a tabela já existia antes, acrescenta a coluna personagem
    // sem apagar as pontuações antigas.
    try {
        $pdo->exec(
            "ALTER TABLE ranking
             ADD COLUMN personagem VARCHAR(20)
             NOT NULL DEFAULT 'monica'"
        );
    } catch (PDOException $e) {
        // A coluna já existe. Não faz nada.
    }

} catch (PDOException $e) {

    http_response_code(500);

    header(
        'Content-Type: application/json; charset=utf-8'
    );

    echo json_encode([
        'status' => 'error',
        'message' =>
            'Não foi possível conectar ao Banco de Dados: '
            . $e->getMessage()
    ]);

    exit;
}
?>