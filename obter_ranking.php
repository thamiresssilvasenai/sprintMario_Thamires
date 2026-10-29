<?php

require_once 'conexao.php';

header(
    'Content-Type: application/json; charset=utf-8'
);

try {

    $stmt = $pdo->query("
        SELECT
            id,
            nome,
            personagem,
            pontos,
            DATE_FORMAT(
                data_registro,
                '%d/%m/%Y %H:%i'
            ) AS data
        FROM ranking
        ORDER BY pontos DESC, id ASC
        LIMIT 10
    ");

    $ranking =
        $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'ranking' => $ranking
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'status' => 'error',
        'message' =>
            'Erro ao carregar ranking.',
        'ranking' => []
    ]);
}
?>