export type Location = {
    id: string;
    city: string;
    state: string;
    country: string;
};

export type FocusArea = {
    id: string;
    mentalHealthEntityId: string;
    name: string;
};

export type AppointmentType = {
    id: string;
    mentalHealthEntityId: string;
    name: string;
    priceMin: number;
    priceMax: number;
};

export type SocialMedia = {
    id: string;
    mentalHealthEntityId: string;
    name: string;
    handle: string;
    url: string;
};

export type academicTitles = {
    id: string;
    mentalHealthEntityId: string;
    title: string;
    professionalId: string;
};

export type MentalHealthEntity = {
    id: string;
    slug?: string;
    entityType: string;
    firstName: string;
    lastName?: string | null;
    pronouns: string[];
    email: string;
    phoneNumber: string;
    whatsApp: string;
    governmentID: string;
    communityAffiliation?: boolean | null;
    bio: string;
    modalities: string[];
    profilePicture: string;
    incluyoBadge: boolean;
    location: Location;
    focusAreas: FocusArea[];
    appointmentTypes: AppointmentType[];
    priceRange: [number, number];
    patientFocus: string[];
    socialMedia: SocialMedia[];
    academicTitles: academicTitles[];
};
