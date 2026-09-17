import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
  fallbackLng: 'es',
  supportedLngs: ['es', 'en'],
  lng: localStorage.getItem('language') || 'es',
  interpolation: { escapeValue: false },
  resources: {
    es: {
      translation: {
        language: 'Idioma', spanish: 'Español', english: 'Inglés', specialPlan: 'Plan especial', previousMonth: 'Mes anterior', nextMonth: 'Mes siguiente', monthDays: 'Días del mes', choosePerfectDay: 'Elige el día perfecto', select: 'Seleccionar', details: 'Detalles de la cita', messageOne: 'Casi me convence.', messageTwo: 'Ese botón sigue dudando.', messageThree: 'Creo que ya sabes cuál es la respuesta.', messageFour: 'No te voy a hacer esperar tanto.', messageFive: 'La decisión ya está clara.',
        proposalTitle: '¿Quieres salir conmigo?', proposalCopy: 'Tengo una propuesta sencilla: tú dices que sí y yo me encargo de que tengamos una cita especial.', yes: 'Sí', no: 'No',
        dateLabel: 'Fecha de la cita', timeLabel: 'Hora de la cita', chooseTime: 'Selecciona una hora', currentTime: 'Usar hora actual', selectTime: 'Selecciona una hora para continuar.', dateTitle: 'Elijamos el día', dateCopy: 'Selecciona la fecha que te gustaría para nuestra salida.', back: 'Atrás', next: 'Siguiente →',
        dinnerTitle: '¿Qué te gustaría cenar?', dinnerCopy: 'Escoge una opción. La parte difícil ya fue decir que sí.', dinnerLabel: 'Selecciona tu cena', pending: 'Pendiente', selected: 'Elegida', dinnerChoose: 'Elige algo delicioso', confirm: 'Confirmar cita',
        successTitle: '¡Tenemos una cita!', successCopy: 'Ahora sí, oficialmente hay plan.', date: 'Fecha de la cita', dinner: 'Cena elegida', restart: 'Empezar de nuevo',
        selectDate: 'Selecciona una fecha para continuar.', futureDate: 'Selecciona una fecha de hoy en adelante.', selectDinner: 'Selecciona qué te gustaría cenar.',
        romantic: 'Romántica', justUs: 'Solo tú y yo', upcoming: 'Próximamente', planned: 'Por decidir', unforgettable: 'Nuestra cita será inolvidable', thoughtful: 'Un plan pensado para nosotros'
      }
    },
    en: {
      translation: {
        language: 'Language', spanish: 'Spanish', english: 'English', specialPlan: 'Special plan', previousMonth: 'Previous month', nextMonth: 'Next month', monthDays: 'Days of the month', choosePerfectDay: 'Choose the perfect day', select: 'Select', details: 'Date details', messageOne: 'You almost convinced me.', messageTwo: 'That button is still unsure.', messageThree: 'I think you already know the answer.', messageFour: 'I won’t keep you waiting.', messageFive: 'The decision is clear now.',
        proposalTitle: 'Would you like to go out with me?', proposalCopy: 'I have a simple proposal: you say yes and I will take care of making our date special.', yes: 'Yes', no: 'No',
        dateLabel: 'Date of our date', timeLabel: 'Time of our date', chooseTime: 'Choose a time', currentTime: 'Use current time', selectTime: 'Choose a time to continue.', dateTitle: 'Let’s choose the day', dateCopy: 'Choose the date you would like for our outing.', back: 'Back', next: 'Next →',
        dinnerTitle: 'What would you like for dinner?', dinnerCopy: 'Choose an option. The hard part was already saying yes.', dinnerLabel: 'Choose your dinner', pending: 'Pending', selected: 'Selected', dinnerChoose: 'Choose something delicious', confirm: 'Confirm date',
        successTitle: 'We have a date!', successCopy: 'That’s it, we officially have a plan.', date: 'Date', dinner: 'Dinner', restart: 'Start over',
        selectDate: 'Choose a date to continue.', futureDate: 'Choose today or a later date.', selectDinner: 'Choose what you would like for dinner.',
        romantic: 'Romantic', justUs: 'Just you and me', upcoming: 'Coming soon', planned: 'To be decided', unforgettable: 'Our date will be unforgettable', thoughtful: 'A plan made for us'
      }
    }
  }
  });

export default i18n;
