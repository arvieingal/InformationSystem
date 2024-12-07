import ImmunizationRecordHistory from '@/components/ImmunizationRecordHistory';
import NutritionalStatusHistory from '@/components/NutritionalStatusHistory';
import SearchBar from '@/components/SearchBar'
import debounce from 'lodash.debounce';
import React from 'react'

export default function ChildHistory() {
    return (
        <div className='h-full w-full px-[3rem]'>
            <ImmunizationRecordHistory />
        </div>
    )
}
