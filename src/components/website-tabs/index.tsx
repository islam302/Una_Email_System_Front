import '../dashboard-tabs/Tab.style.css';
import { useState } from 'react';
import MonthlyTab from './Monthly';
import YearlyTab from './Yearly';
import { TabView, TabPanel } from 'primereact/tabview';

export default function PlanSelect() {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="w-full h-auto">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Monthly">
                    <MonthlyTab />
                </TabPanel>
                <TabPanel header="Yearly -20% off">
                    <YearlyTab />
                </TabPanel>
            </TabView>
        </div>
    );
}