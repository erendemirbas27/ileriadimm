export default class CalendarView {
    constructor() {
        this.calendarContainer = document.createElement('div');
        this.calendarContainer.className = 'calendar-container';
        this.calendarContainer.style.display = 'none';
        document.querySelector('.main-content .container').appendChild(this.calendarContainer);
          const container = document.querySelector('.main-content .container');
        if (container) {
            container.appendChild(this.calendarContainer);
        } else {
            console.warn('Container element not found, appending to body');
            document.body.appendChild(this.calendarContainer);
        }
    }

    renderCalendarPage(events) {
        this.calendarContainer.innerHTML = `
            <div class="section-header">
                <h2>Etkinlik Takvimi</h2>
                <p>Eğitim etkinliklerini kaçırmayın</p>
            </div>
            
            <div class="calendar-controls">
                <div class="month-navigation">
                    <button class="nav-btn prev-month"><i class="fas fa-chevron-left"></i></button>
                    <h3 id="current-month">Haziran 2023</h3>
                    <button class="nav-btn next-month"><i class="fas fa-chevron-right"></i></button>
                </div>
                
                <div class="calendar-view-toggle">
                    <button class="view-btn active" data-view="month">Ay</button>
                    <button class="view-btn" data-view="week">Hafta</button>
                    <button class="view-btn" data-view="list">Liste</button>
                </div>
                
                <button class="btn btn-primary add-event-btn">Etkinlik Ekle</button>
            </div>
            
            <div class="calendar-view month-view active">
                <div class="calendar-grid">
                    <div class="calendar-header">
                        <div class="day-name">Paz</div>
                        <div class="day-name">Pzt</div>
                        <div class="day-name">Sal</div>
                        <div class="day-name">Çar</div>
                        <div class="day-name">Per</div>
                        <div class="day-name">Cum</div>
                        <div class="day-name">Cmt</div>
                    </div>
                    <div class="calendar-body" id="calendar-body">
                        ${this.renderCalendarMonth(events)}
                    </div>
                </div>
            </div>
            
            <div class="calendar-view week-view">
                <div class="week-grid">
                    ${this.renderCalendarWeek(events)}
                </div>
            </div>
            
            <div class="calendar-view list-view">
                <div class="event-list">
                    ${this.renderEventList(events)}
                </div>
            </div>
        `;
        
        this.calendarContainer.style.display = 'block';
        
        // Görünüm değiştirme butonları
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const view = btn.dataset.view;
                this.changeCalendarView(view);
            });
        });
        
        // Ay navigasyonu
        document.querySelector('.prev-month').addEventListener('click', () => {
            this.changeMonth(-1);
        });
        
        document.querySelector('.next-month').addEventListener('click', () => {
            this.changeMonth(1);
        });
        
        // Etkinlik ekleme butonu
        document.querySelector('.add-event-btn').addEventListener('click', () => {
            this.showAddEventForm();
        });
    }

    renderCalendarMonth(events) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Ayın ilk günü
        const firstDay = new Date(year, month, 1);
        // Ayın son günü
        const lastDay = new Date(year, month + 1, 0);
        
        // Önceki ayın son günleri
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const firstDayOfWeek = firstDay.getDay();
        
        let html = '';
        
        // Önceki ayın günleri
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            html += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        // Mevcut ayın günleri
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date.startsWith(dateStr));
            const isToday = this.isToday(year, month, day);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    <div class="day-events">
                        ${dayEvents.slice(0, 2).map(event => `
                            <div class="event-dot ${event.category}"></div>
                        `).join('')}
                        ${dayEvents.length > 2 ? `<div class="more-events">+${dayEvents.length - 2}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Sonraki ayın günleri
        const totalCells = 42; // 6 satır x 7 gün
        const currentDays = firstDayOfWeek + lastDay.getDate();
        const nextMonthDays = totalCells - currentDays;
        
        for (let day = 1; day <= nextMonthDays; day++) {
            html += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        return html;
    }

    renderCalendarWeek(events) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
        
        let html = '';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            const dayEvents = events.filter(event => event.date.startsWith(dateStr));
            const isToday = this.isToday(date.getFullYear(), date.getMonth(), date.getDate());
            
            html += `
                <div class="week-day ${isToday ? 'today' : ''}">
                    <div class="day-header">
                        <div class="day-name">${this.getDayName(date.getDay())}</div>
                        <div class="day-number">${date.getDate()}</div>
                    </div>
                    <div class="day-events">
                        ${dayEvents.map(event => `
                            <div class="event-item ${event.category}">
                                <div class="event-time">${event.time}</div>
                                <div class="event-title">${event.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    renderEventList(events) {
        // Tarihe göre sırala
        const sortedEvents = [...events].sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });
        
        let html = '';
        let currentDate = '';
        
        sortedEvents.forEach(event => {
            const eventDate = event.date;
            
            if (eventDate !== currentDate) {
                currentDate = eventDate;
                const dateObj = new Date(eventDate);
                const formattedDate = dateObj.toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                html += `<div class="event-date-header">${formattedDate}</div>`;
            }
            
            html += `
                <div class="event-list-item ${event.category}">
                    <div class="event-time">${event.time}</div>
                    <div class="event-details">
                        <div class="event-title">${event.title}</div>
                        <div class="event-location">${event.location}</div>
                    </div>
                    <div class="event-actions">
                        <button class="btn-icon edit-event-btn" data-id="${event.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-event-btn" data-id="${event.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    changeCalendarView(view) {
        document.querySelectorAll('.calendar-view').forEach(v => {
            v.classList.remove('active');
        });
        document.querySelector(`.${view}-view`).classList.add('active');
    }

    changeMonth(direction) {
        // Gerçek uygulamada takvim güncellenecek
        console.log(`Ay değiştiriliyor: ${direction}`);
    }

    showAddEventForm() {
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Yeni Etkinlik Ekle</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="add-event-form">
                            <div class="form-group">
                                <label for="event-title">Başlık:</label>
                                <input type="text" id="event-title" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="event-date">Tarih:</label>
                                <input type="date" id="event-date" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="event-time">Saat:</label>
                                <input type="time" id="event-time" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="event-location">Konum:</label>
                                <input type="text" id="event-location" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="event-category">Kategori:</label>
                                <select id="event-category" required>
                                    <option value="education">Eğitim</option>
                                    <option value="career">Kariyer</option>
                                    <option value="social">Sosyal</option>
                                    <option value="competition">Yarışma</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="event-description">Açıklama:</label>
                                <textarea id="event-description" rows="4"></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Kaydet</button>
                                <button type="button" class="btn btn-secondary modal-close">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        // Modal kapatma olayları
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.modal-overlay').remove();
            });
        });
        
        // Form gönderme
        document.getElementById('add-event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const eventData = {
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-location').value,
                category: document.getElementById('event-category').value,
                description: document.getElementById('event-description').value
            };
            
            // Veriyi controller'a gönder
            this.controller.addEvent(eventData);
            
            // Modal'ı kapat
            document.querySelector('.modal-overlay').remove();
        });
    }

    isToday(year, month, day) {
        const today = new Date();
        return year === today.getFullYear() && 
               month === today.getMonth() && 
               day === today.getDate();
    }

    getDayName(dayIndex) {
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return days[dayIndex];
    }

    hideCalendarPage() {
        this.calendarContainer.style.display = 'none';
    }
}