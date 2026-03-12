type UmamiEventValue =
    | string
    | number
    | boolean
    | string[]
    | Record<string, string[]>;
type UmamiEventData = Record<string, UmamiEventValue>;

interface UmamiEvent {
    name: string;
    data?: UmamiEventData;
}

declare global {
    interface Window {
        umami?: {
            track?: (eventName: string, eventData?: UmamiEventData) => void;
        };
    }
}

function removeEmptyEventData(data: UmamiEventData) {
    return Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== '')
    ) as UmamiEventData;
}

export function createUmamiEvent(
    name: string,
    data: UmamiEventData = {}
): UmamiEvent {
    const eventData = removeEmptyEventData(data);

    return {
        name,
        ...(Object.keys(eventData).length > 0 ? { data: eventData } : {}),
    };
}

export function sendUmamiEvent(event: UmamiEvent) {
    if (typeof window === 'undefined') return;

    window.umami?.track?.(event.name, event.data);
}
