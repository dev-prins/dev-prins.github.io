:root { --primary-color: #FF6F61; --secondary-color: #4A4A4A; --background-color: #f9f9f9; --font-color: #333; --holiday-color: #E63946; --today-color: #457B9D; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: var(--background-color); color: var(--font-color); margin: 0; text-align: center; }
header { background: linear-gradient(135deg, var(--primary-color), #E63946); color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
h1, h2, h3 { font-weight: 600; }
#monthly-media { position: relative; width: 100%; height: 250px; overflow: hidden; background-color: #eee; }
#monthly-photo { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
#monthly-photo:hover { transform: scale(1.05); }
#mute-btn { position: absolute; bottom: 10px; right: 10px; background: rgba(0, 0, 0, 0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; }
.calendar-container { max-width: 95%; margin: 1rem auto; padding: 1rem; background-color: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.calendar-header button { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--primary-color); padding: 0.5rem; }
.weekdays, .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.weekdays div { font-weight: 600; color: var(--secondary-color); padding-bottom: 0.5rem; }
.days-grid .day { padding: 0.8rem 0.2rem; border-radius: 8px; border: 1px solid #eee; min-height: 80px; cursor: pointer; transition: background-color 0.3s, transform 0.2s; position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
.days-grid .day:hover { background-color: #f0f0f0; transform: translateY(-3px); }
.day span { font-size: 1.2rem; }
.day .holiday-name { font-size: 0.7rem; color: var(--holiday-color); font-weight: bold; padding: 2px 4px; border-radius: 4px; }
.day.empty { background-color: transparent; border: none; cursor: default; }
.day.today { background-color: var(--today-color); color: white; font-weight: bold; }
.day.holiday span { color: var(--holiday-color); font-weight: bold; }
.credits { font-size: 0.8rem; color: #aaa; margin-top: 2rem; }
.modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); justify-content: center; align-items: center; }
.modal-content { background: white; padding: 2rem; border-radius: 10px; width: 90%; max-width: 500px; position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.close-btn { position: absolute; top: 10px; right: 20px; font-size: 2rem; cursor: pointer; color: #aaa; }
.modal-content input, .modal-content textarea, .modal-content button { width: 95%; padding: 0.8rem; margin-top: 1rem; border-radius: 5px; border: 1px solid #ccc; font-family: inherit; }
.modal-content button { background-color: var(--primary-color); color: white; border: none; cursor: pointer; font-weight: 600; }
.alarm-section { border-top: 1px solid #eee; margin-top: 1rem; padding-top: 1rem; }
.holiday-text { color: var(--holiday-color); font-weight: bold; margin-top: 0; }
