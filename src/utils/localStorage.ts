export const loadFromLocalStorage = (key: string): any => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const saveToLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};
