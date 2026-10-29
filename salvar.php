<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);

    exit;
}

$input = json_decode(
    file_get_contents('php://input'),
    true
);

if (!$input) {
    $input = $_POST;
}

$nome = isset($input['nome'])
    ? trim($input['nome'])
    : '';

$personagem = isset($input['personagem'])
    ? trim($input['personagem'])
    : 'monica';

$pontos = isset($input['pontos'])
    ? (int)$input['pontos']
    : 0;

if (empty($nome)) {
    $nome = 'Jogador Anônimo';
}

$nome = mb_substr($nome, 0, 40);

$personagensValidos = [
    'monica',
    'mônica',
    'magali',
    'cascao',
    'cascão'
];

if (!in_array($personagem, $personagensValidos, true)) {
    $personagem = 'monica';
}

try {

    $stmt = $pdo->prepare("
        INSERT INTO ranking
        (nome, personagem, pontos)
        VALUES
        (:nome, :personagem, :pontos)
    ");

    $stmt->execute([
        ':nome' => $nome,
        ':personagem' => $personagem,
        ':pontos' => $pontos
    ]);

    $stmtRanking = $pdo->prepare("
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

    $stmtRanking->execute();

    $ranking = $stmtRanking->fetchAll();

    echo json_encode([
        'status' => 'success',
        'message' =>
            'Pontuação registrada com sucesso!',
        'ranking' => $ranking
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'status' => 'error',
        'message' =>
            'Erro ao salvar no banco: '
            . $e->getMessage()
    ]);
}
?>