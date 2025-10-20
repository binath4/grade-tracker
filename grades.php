<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

include 'db.php';

// GET - Fetch all students
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM students ORDER BY id DESC");
    
    if (!$result) {
        echo json_encode(['error' => 'Query failed: ' . $conn->error]);
        exit;
    }
    
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    
    echo json_encode($rows);
    exit;
}

// POST - Add new student
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['name']) || !isset($data['subject']) || !isset($data['marks'])) {
        echo json_encode(['error' => 'Invalid input data', 'received' => $data]);
        exit;
    }
    
    $name = $conn->real_escape_string(trim($data['name']));
    $subject = $conn->real_escape_string(trim($data['subject']));
    $marks = intval($data['marks']);
    
    if ($marks < 0 || $marks > 100) {
        echo json_encode(['error' => 'Marks must be between 0 and 100']);
        exit;
    }
    
    $sql = "INSERT INTO students (name, subject, marks) VALUES ('$name', '$subject', $marks)";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "status" => "ok",
            "id" => $conn->insert_id,
            "message" => "Student added successfully"
        ]);
    } else {
        echo json_encode(['error' => 'Insert failed: ' . $conn->error, 'sql' => $sql]);
    }
    exit;
}

// DELETE - Remove student
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['error' => 'Invalid ID']);
        exit;
    }
    
    $id = intval($data['id']);
    $sql = "DELETE FROM students WHERE id = $id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "deleted", "message" => "Student deleted successfully"]);
    } else {
        echo json_encode(['error' => 'Delete failed: ' . $conn->error]);
    }
    exit;
}

$conn->close();
?>
