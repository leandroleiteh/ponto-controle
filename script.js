document.addEventListener('DOMContentLoaded', (event) => {
    loadSavedData();
    loadHistory();
    setAlarms();
});

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
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('lunchStart', lunchStart);
    localStorage.setItem('lunchEnd', lunchEnd);
}

function loadSavedData() {
    const startTime = localStorage.getItem('startTime');
    const lunchStart = localStorage.getItem('lunchStart');
    const lunchEnd = localStorage.getItem('lunchEnd');

    if (startTime) document.getElementById('startTime').value = startTime;
    if (lunchStart) document.getElementById('lunchStart').value = lunchStart;
    if (lunchEnd) document.getElementById('lunchEnd').value = lunchEnd;
}

function resetData() {
    localStorage.removeItem('startTime');
    localStorage.removeItem('lunchStart');
    localStorage.removeItem('lunchEnd');
    document.getElementById('timeForm').reset();
    document.getElementById('results').innerHTML = '';
    document.getElementById('exitForm').style.display = 'none';
    document.getElementById('workedResults').style.display = 'none';
}

function addToHistory(startTime, lunchStart, lunchEnd, endTime, workedHours, extraHours, missingHours) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
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
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
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
}

function filterHistory() {
    const monthFilter = document.getElementById('monthFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const history = JSON.parse(localStorage.getItem('history')) || [];
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
}

function clearHistory() {
    localStorage.removeItem('history');
    loadHistory();
}

function setAlarms() {
    const startTime = localStorage.getItem('startTime');
    const lunchStart = localStorage.getItem('lunchStart');
    const lunchEnd = localStorage.getItem('lunchEnd');
    const endTime = document.getElementById('exitTime').textContent.split(': ')[1];

    if (startTime) setAlarm(startTime, 'Hora de Entrada');
    if (lunchStart) setAlarm(lunchStart, 'Início do Almoço');
    if (lunchEnd) setAlarm(lunchEnd, 'Fim do Almoço');
    if (endTime) setAlarm(endTime, 'Hora de Saída');
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