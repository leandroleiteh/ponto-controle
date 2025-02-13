document.addEventListener('DOMContentLoaded', (event) => {
    // checkLogin();
    // if (localStorage.getItem('currentUser')) {
        loadSavedData();
        loadHistory();
        setAlarms();
    // }
});

// function register() {
//     const username = document.getElementById('registerUsername').value;
//     const password = document.getElementById('registerPassword').value;

//     if (username && password) {
//         const users = JSON.parse(localStorage.getItem('users')) || {};
//         if (users[username]) {
//             alert('Usuário já existe.');
//         } else {
//             users[username] = { password, data: {}, history: [] };
//             localStorage.setItem('users', JSON.stringify(users));
//             alert('Cadastro realizado com sucesso!');
//             // showLoginForm();
//         }
//     } else {
//         alert('Por favor, preencha todos os campos.');
//     }
// }

// function login() {
//     const username = document.getElementById('loginUsername').value;
//     const password = document.getElementById('loginPassword').value;

//     const users = JSON.parse(localStorage.getItem('users')) || {};
//     if (users[username] && users[username].password === password) {
//         localStorage.setItem('currentUser', username);
//         localStorage.setItem('loginTime', Date.now());
//         alert('Login realizado com sucesso!');
//         showTimeControlForm();
//     } else {
//         alert('Usuário ou senha incorretos.');
//     }
// }

// function logout() {
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('loginTime');
//     alert('Você foi desconectado.');
//     showLoginForm();
// }

// function checkLogin() {
//     const loginTime = localStorage.getItem('loginTime');
//     if (loginTime && Date.now() - loginTime > 3600000) { // 1 hora em milissegundos
//         logout();
//     } else if (localStorage.getItem('currentUser')) {
//         showTimeControlForm();
//     } else {
//         showLoginForm();
//     }
// }

// function showLoginForm() {
//     document.getElementById('loginForm').style.display = 'block';
//     document.getElementById('registerForm').style.display = 'none';
//     document.getElementById('resetPasswordForm').style.display = 'none';
//     document.getElementById('timeControlForm').style.display = 'none';
// }

// function showRegisterForm() {
//     document.getElementById('loginForm').style.display = 'none';
//     document.getElementById('registerForm').style.display = 'block';
//     document.getElementById('resetPasswordForm').style.display = 'none';
//     document.getElementById('timeControlForm').style.display = 'none';
// }

// function showResetPasswordForm() {
//     document.getElementById('loginForm').style.display = 'none';
//     document.getElementById('registerForm').style.display = 'none';
//     document.getElementById('resetPasswordForm').style.display = 'block';
//     document.getElementById('timeControlForm').style.display = 'none';
// }

function showTimeControlForm() {
    // document.getElementById('loginForm').style.display = 'none';
    // document.getElementById('registerForm').style.display = 'none';
    // document.getElementById('resetPasswordForm').style.display = 'none';
    // document.getElementById('timeControlForm').style.display = 'block';
    loadUserData();
}

function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userData = users[currentUser]?.data || {};

        document.getElementById('startTime').value = userData.startTime || '';
        document.getElementById('lunchStart').value = userData.lunchStart || '';
        document.getElementById('lunchEnd').value = userData.lunchEnd || '';
        document.getElementById('endTime').value = userData.endTime || '';
    // }
}

function saveData(startTime, lunchStart, lunchEnd) {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[currentUser].data = { startTime, lunchStart, lunchEnd };
        localStorage.setItem('users', JSON.stringify(users));
    // }
}

function addToHistory(startTime, lunchStart, lunchEnd, endTime, workedHours, extraHours, missingHours) {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const history = users[currentUser].history || [];
        const today = new Date().toLocaleDateString('pt-BR');
        history.push({
            date: today,
            startTime,
            lunchStart,
            lunchEnd,
            endTime,
            workedHours: formatHours(workedHours),
            extraHours: formatHours(extraHours),
            missingHours: formatHours(missingHours)
        });
        users[currentUser].history = history;
        localStorage.setItem('users', JSON.stringify(users));
        loadHistory();
    // }
}

function loadHistory() {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const history = users[currentUser].history || [];
        const historyTable = document.getElementById('history');
        historyTable.innerHTML = '';
        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.startTime}</td>
                <td>${entry.lunchStart}</td>
                <td>${entry.lunchEnd}</td>
                <td>${entry.endTime}</td>
                <td>${entry.workedHours}</td>
                <td>${entry.extraHours}</td>
                <td>${entry.missingHours}</td>
            `;
            historyTable.appendChild(row);
        });
    // }
}

function filterHistory() {
    const monthFilter = document.getElementById('monthFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const history = users[currentUser].history || [];
        const filteredHistory = history.filter(entry => {
            const entryDate = new Date(entry.date.split('/').reverse().join('-'));
            const entryMonth = entryDate.getMonth() + 1;
            const entryYear = entryDate.getFullYear();
            return (!monthFilter || entryMonth === parseInt(monthFilter.split('-')[1])) &&
                   (!yearFilter || entryYear === parseInt(yearFilter));
        });
        const historyTable = document.getElementById('history');
        historyTable.innerHTML = '';
        filteredHistory.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.startTime}</td>
                <td>${entry.lunchStart}</td>
                <td>${entry.lunchEnd}</td>
                <td>${entry.endTime}</td>
                <td>${entry.workedHours}</td>
                <td>${entry.extraHours}</td>
                <td>${entry.missingHours}</td>
            `;
            historyTable.appendChild(row);
        });
    // }
}

function clearHistory() {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[currentUser].history = [];
        localStorage.setItem('users', JSON.stringify(users));
        loadHistory();
    // }
}

function calculateExitTime(button) {
    const startTime = document.getElementById('startTime').value;
    const lunchStart = document.getElementById('lunchStart').value;
    const lunchEnd = document.getElementById('lunchEnd').value;

    console.log('Calculating exit time...');
    console.log('Start Time:', startTime);
    console.log('Lunch Start:', lunchStart);
    console.log('Lunch End:', lunchEnd);

    if (startTime && lunchStart && lunchEnd) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const lunchS = new Date(`1970-01-01T${lunchStart}:00`);
        const lunchE = new Date(`1970-01-01T${lunchEnd}:00`);
        const end = new Date(start.getTime() + 8 * 60 * 60 * 1000 + (lunchE - lunchS));

        document.getElementById('exitTime').textContent = `Hora de Sair: ${end.toTimeString().slice(0, 5)}`;
        document.getElementById('exitForm').style.display = 'block';

        button.classList.remove('animate__pulse', 'animate__infinite');

        saveData(startTime, lunchStart, lunchEnd);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function calculateWorkedHours(button) {
    const startTime = document.getElementById('startTime').value;
    const lunchStart = document.getElementById('lunchStart').value;
    const lunchEnd = document.getElementById('lunchEnd').value;
    const endTime = document.getElementById('endTime').value;

    console.log('Calculating worked hours...');
    console.log('Start Time:', startTime);
    console.log('Lunch Start:', lunchStart);
    console.log('Lunch End:', lunchEnd);
    console.log('End Time:', endTime);

    if (startTime && lunchStart && lunchEnd && endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const lunchS = new Date(`1970-01-01T${lunchStart}:00`);
        const lunchE = new Date(`1970-01-01T${lunchEnd}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        const workedHours = ((lunchS - start) + (end - lunchE)) / (1000 * 60 * 60);
        const extraHours = workedHours > 8 ? workedHours - 8 : 0;
        const missingHours = workedHours < 8 ? 8 - workedHours : 0;

        document.getElementById('workedHours').textContent = `Horas Trabalhadas: ${formatHours(workedHours)}`;
        document.getElementById('extraHours').textContent = `Horas Extras: ${formatHours(extraHours)}`;
        document.getElementById('missingHours').textContent = `Horas Faltantes: ${formatHours(missingHours)}`;

        document.getElementById('workedResults').style.display = 'block';

        button.classList.remove('animate__pulse', 'animate__infinite');

        addToHistory(startTime, lunchStart, lunchEnd, endTime, workedHours, extraHours, missingHours);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function formatHours(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function saveData(startTime, lunchStart, lunchEnd) {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[currentUser].data = { startTime, lunchStart, lunchEnd };
        localStorage.setItem('users', JSON.stringify(users));
    // }
}

function loadSavedData() {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userData = users[currentUser]?.data || {};

        if (userData.startTime) document.getElementById('startTime').value = userData.startTime;
        if (userData.lunchStart) document.getElementById('lunchStart').value = userData.lunchStart;
        if (userData.lunchEnd) document.getElementById('lunchEnd').value = userData.lunchEnd;
    // }
}

function resetData() {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[currentUser].data = {};
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('timeForm').reset();
        document.getElementById('results').innerHTML = '';
        document.getElementById('exitForm').style.display = 'none';
        document.getElementById('workedResults').style.display = 'none';
    // }
}

function setAlarms() {
    const currentUser = localStorage.getItem('currentUser');
    // if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userData = users[currentUser].data || {};
        const endTime = document.getElementById('exitTime').textContent.split(': ')[1];

        if (userData.startTime) setAlarm(userData.startTime, 'Hora de Entrada');
        if (userData.lunchStart) setAlarm(userData.lunchStart, 'Início do Almoço');
        if (userData.lunchEnd) setAlarm(userData.lunchEnd, 'Fim do Almoço');
        if (endTime) setAlarm(endTime, 'Hora de Saída');
    // }
}

function setAlarm(time, label) {
    const now = new Date();
    const alarmTime = new Date(now.toDateString() + ' ' + time);
    const timeToAlarm = alarmTime - now;

    if (timeToAlarm > 0) {
        setTimeout(() => {
            Swal.fire({
                title: 'Alarme',
                text: `Alarme: ${label}`,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        }, timeToAlarm);
    }
}

function resetPassword() {
    const username = document.getElementById('resetUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (username && newPassword) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            users[username].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Senha redefinida com sucesso!');
            showLoginForm();
        } else {
            alert('Usuário não encontrado.');
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

//
document.addEventListener('keydown', function(event) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I') || (event.ctrlKey && event.shiftKey && event.key === 'J') || (event.ctrlKey && event.key === 'U')) {
        event.preventDefault();
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
})

//
