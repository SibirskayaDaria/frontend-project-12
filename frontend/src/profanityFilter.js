import leoProfanity from "leo-profanity";

// Загружаем словари для фильтрации
leoProfanity.loadDictionary("ru");
leoProfanity.loadDictionary("en");

export const filterText = (text) => leoProfanity.clean(text);
export const containsProfanity = (text) => leoProfanity.check(text);
export default filterText;
