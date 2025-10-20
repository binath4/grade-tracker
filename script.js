document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const subjectInput = document.getElementById('subject');
    const marksInput = document.getElementById('marks');
    const addBtn = document.getElementById('addBtn');
    const tableBody = document.getElementById('tableBody');

    function getGrade(marks) {
        if (marks >= 75) return 'A';
        if (marks >= 65) return 'B';
        if (marks >= 50) return 'C';
        if (marks >= 35) return 'D';
        return 'F';
    }

    async function loadData() {
        try {
            const res = await fetch('grades.php');
            if (!res.ok) throw new Error('Load failed');
            const data = await res.json();
            if (data.error) {
                alert('Error loading data: ' + data.error);
                return;
            }
            renderTable(data);
        } catch (error) {
            alert('Network error: ' + error.message);
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach((s) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${s.name}</td>
                <td>${s.subject}</td>
                <td>${s.marks}</td>
                <td>${getGrade(s.marks)}</td>
                <td><button class="delete-btn" data-id="${s.id}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', e => deleteRow(e.target.dataset.id));
        });
    }

    async function addStudent() {
        const name = nameInput.value.trim();
        const subject = subjectInput.value.trim();
        const marks = parseInt(marksInput.value);
        if (!name || !subject || isNaN(marks) || marks < 0 || marks > 100) {
            alert('Please enter valid name, subject, and marks (0-100).');
            return;
        }

        try {
            const res = await fetch('grades.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, subject, marks })
            });
            if (!res.ok) throw new Error('Add failed');
            const result = await res.json();
            if (result.error) {
                alert('Error adding student: ' + result.error);
                return;
            }
            nameInput.value = '';
            subjectInput.value = '';
            marksInput.value = '';
            loadData();
        } catch (error) {
            alert('Network error: ' + error.message);
        }
    }

    async function deleteRow(id) {
        if (!confirm('Delete this student?')) return;
        try {
            const res = await fetch('grades.php', {
                method: 'DELETE',
                body: `id=${id}`,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            if (!res.ok) throw new Error('Delete failed');
            const result = await res.json();
            if (result.error) {
                alert('Error deleting: ' + result.error);
                return;
            }
            loadData();
        } catch (error) {
            alert('Network error: ' + error.message);
        }
    }

    addBtn.addEventListener('click', addStudent);
    loadData();
});
