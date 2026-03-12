export const PROFILES_STRUCTURED_DATA_SCRIPT_ID = 'profiles-structured-data';

export interface StructuredDataProfile {
    objectID: string;
    firstName: string;
    lastName?: string | null;
    entityType: string;
    profilePicture?: string | null;
    city?: string | null;
    state?: string | null;
    modalities?: string[];
}

export interface ProfilesStructuredDataOptions {
    profiles: StructuredDataProfile[];
    url: string;
    page?: number;
    hitsPerPage?: number;
}

const PAGE_NAME = 'Perfiles - Directorio de Salud Mental LGBTQ+';
const PAGE_DESCRIPTION =
    'Encuentra profesionistas de la salud mental con perspectiva de diversidad sexual y de género en el Directorio de Salud Mental LGBTQ+.';

function getProfileName(profile: StructuredDataProfile) {
    return profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile.firstName;
}

function getProfileUrl(profile: StructuredDataProfile, baseUrl: string) {
    return new URL(`/perfil/id/${profile.objectID}`, baseUrl).toString();
}

export function buildProfilesStructuredData({
    profiles,
    url,
    page = 1,
    hitsPerPage = profiles.length,
}: ProfilesStructuredDataOptions) {
    const itemListElement = profiles.map((profile, index) => {
        const type = profile.entityType.toLowerCase().includes('psic')
            ? 'Person'
            : 'MedicalBusiness';
        const profileUrl = getProfileUrl(profile, url);

        return {
            '@type': 'ListItem',
            position: index + 1,
            url: profileUrl,
            item: {
                '@type': type,
                name: getProfileName(profile),
                ...(type === 'Person' && { jobTitle: profile.entityType }),
                ...(profile.profilePicture && {
                    image: profile.profilePicture,
                }),
                url: profileUrl,
                ...(profile.city &&
                    profile.state && {
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: profile.city,
                        addressRegion: profile.state,
                        addressCountry: 'MX',
                    },
                }),
            },
        };
    });

    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: PAGE_NAME,
        description: PAGE_DESCRIPTION,
        url,
        mainEntity: {
            '@type': 'ItemList',
            name: 'Perfiles de profesionistas de salud mental LGBTQ+',
            numberOfItems: profiles.length,
            itemListElement,
        },
    };
}

export function updateProfilesStructuredData(
    options: ProfilesStructuredDataOptions
) {
    const script = document.getElementById(PROFILES_STRUCTURED_DATA_SCRIPT_ID);
    if (!script) return;

    script.textContent = JSON.stringify(buildProfilesStructuredData(options));
}
