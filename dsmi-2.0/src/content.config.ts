import { defineCollection, z } from 'astro:content';
import { createClient } from '@supabase/supabase-js';
import type { MentalHealthEntity } from './content.types';

// Create a single Supabase client for interacting with your database
const supabase = createClient(
    'https://tkmrpojsltxhllgkqhpa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbXJwb2pzbHR4aGxsZ2txaHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1NzM2NjksImV4cCI6MjAxODE0OTY2OX0.O_gqfDEoRRvKqtgJuBdPlHcoYNJa0_maRamlPOrfAHo'
);

const mentalHealthEntities = defineCollection({
    loader: async () => {
        let { data, error } = await supabase
            .from('mental-health-entities')
            .select('*');

        if (!data && error) {
            throw error;
        }

        return data as Array<MentalHealthEntity>;
    },
});

const locations = defineCollection({
    loader: async () => {
        let { data, error } = await supabase.from('locations').select('*');

        if (!data && error) {
            throw error;
        }

        return data as Array<{ id: string } & Record<string, any>>;
    },
});

const socialMedia = defineCollection({
    loader: async () => {
        let { data, error } = await supabase.from('social-media').select('*');

        if (!data && error) {
            throw error;
        }
        return data as Array<{ id: string } & Record<string, any>>;
    },
});

const profiles = defineCollection({
    loader: async () => {
        const { data: profilesData, error: profilesError } = await supabase
            .from('mental-health-entities')
            .select('*');

        if (!profilesData && profilesError) {
            throw profilesError;
        }

        const { data: locationsData, error: locationsError } = await supabase
            .from('locations')
            .select('*');

        if (!locationsData && locationsError) {
            throw locationsError;
        }

        const { data: focusAreasData, error: focusAreasError } = await supabase
            .from('focus-areas')
            .select('*');

        if (!focusAreasData && focusAreasError) {
            throw focusAreasError;
        }

        const { data: appointmentTypesData, error: appointmentTypesError } =
            await supabase.from('appointment-types').select('*');

        if (!appointmentTypesData && appointmentTypesError) {
            throw appointmentTypesError;
        }

        const { data: socialMediaData, error: socialMediaError } =
            await supabase.from('social-media').select('*');

        if (!socialMediaData && socialMediaError) {
            throw socialMediaError;
        }

        const { data: academicTitlesData, error: academicTitlesError } =
            await supabase.from('academic-titles').select('*');

        if (!academicTitlesData && academicTitlesError) {
            throw academicTitlesError;
        }

        const profilesObject: Array<MentalHealthEntity> = [];

        profilesData.forEach((profile) => {
            // Slug
            profile.slug = profile.slug;

            // Pronouns
            profile.pronouns = profile.pronouns?.split('/') || [];

            // Location
            profile.location = locationsData.find(
                (location) => location.id === profile.location
            );

            // Focus Areas
            profile.focusAreas = focusAreasData.filter(
                (focusArea) => focusArea.mentalHealthEntityId === profile.id
            );

            // TODO: Patient Focus
            profile.patientFocus = [];

            // Appointment Types
            const appointmentTypes = appointmentTypesData.filter(
                (appointmentType) =>
                    appointmentType.mentalHealthEntityId === profile.id
            );
            profile.appointmentTypes = appointmentTypes;

            // Price Range
            const min = Math.min(
                ...appointmentTypes.map((item) => item.priceMin)
            );
            const max = Math.max(
                ...appointmentTypes.map((item) => item.priceMax)
            );
            profile.priceRange = [min, max];

            // Social Media
            profile.socialMedia = socialMediaData.filter(
                (socialMedia) => socialMedia.mentalHealthEntityId === profile.id
            );

            // TODO: Academic Titles
            profile.academicTitles = academicTitlesData.filter(
                (academicTitle) =>
                    academicTitle.mentalHealthEntityId === profile.id
            );

            profilesObject.push(profile);
        });
        return profilesObject;
    },
});

export const collections = { profiles, locations, socialMedia };
