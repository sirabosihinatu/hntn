const DAY_OF_WEEK_TEXTS = ['日', '月', '火', '水', '木', '金', '土'];

function getSpecificDayOfMonth(year, month, dayOfWeek, weekIndex, time) {
    const date = new Date(year, month, 1);
    let count = 0;

    while (date.getMonth() === month) {
        if (date.getDay() === dayOfWeek) {
            count++;
            if (count === weekIndex) {
                const eventDate = new Date(year, month, date.getDate());
                return {
                    date: eventDate,
                    dayOfWeekText: DAY_OF_WEEK_TEXTS[dayOfWeek],
                    time
                };
            }
        }
        date.setDate(date.getDate() + 1);
    }
    return null;
}

function generateCalendarData(yearsToLookAhead = 1) {
    const today = new Date();
    const eventList = [];
    const currentYear = today.getFullYear();
    const endYear = currentYear + yearsToLookAhead;

    for (let year = currentYear; year <= endYear; year++) {
        for (let month = 0; month < 12; month++) {
            const events = [
                { event: getSpecificDayOfMonth(year, month, 5, 2, "22:00"), hour: 22 },
                { event: getSpecificDayOfMonth(year, month, 6, 4, "21:00"), hour: 21 }
            ];

            events.forEach(({ event, hour }) => {
                if (event) {
                    const eventDateTime = new Date(event.date);
                    eventDateTime.setHours(hour, 0, 0, 0);
                    if (eventDateTime > today) {
                        eventList.push(event);
                    }
                }
            });
        }
    }

    return eventList.sort((a, b) => a.date - b.date);
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return { month, day };
}

function createEventHTML(event, isHighlight = false) {
    const { month, day } = formatDate(event.date);
    const className = isHighlight ? 'event-item highlight-event' : 'event-item';
    return `
        <div class="${className}">
            <span class="date">${month}/${day} ${event.dayOfWeekText}</span>
            <span class="time">${event.time}～</span>
        </div>
    `;
}

function renderCalendar(events) {
    if (events.length === 0) {
        return '<p>現在のところ、予定されている開催日はありません。</p>';
    }

    const [nextEvent, ...otherEvents] = events;
    let html = `
        <div class="calendar-section">
            <h3 class="section-title">直近の開催予定</h3>
            ${createEventHTML(nextEvent, true)}
        </div>
    `;

    if (otherEvents.length > 0) {
        html += '<div class="calendar-section other-events-section">';
        let currentYear = null;

        otherEvents.forEach(event => {
            const year = event.date.getFullYear();
            if (year !== currentYear) {
                if (currentYear !== null) html += '</div>';
                currentYear = year;
                html += `<h3 class="section-title event-year">${year}年</h3><div class="year-events-list">`;
            }
            html += createEventHTML(event);
        });

        html += '</div></div>';
    }

    return html;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('calendar-container');
    if (!container) {
        console.error('ID "calendar-container" が見つかりません。');
        return;
    }

    const futureEvents = generateCalendarData(1);
    container.innerHTML = renderCalendar(futureEvents);
});