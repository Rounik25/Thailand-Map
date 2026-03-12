import { useMemo } from "react";
import Filters from "./Cards/Filter";
import RevenueByRegionPie from "./Cards/RevenueByRegionPie";
import OrdersVsSalesChart from "./Cards/OrdersVsSalesChart";
import MonthlyConversionChart from "./Cards/MonthlyConversionChart";

import {
    getMonthOptions,
    getCityOptions,
    getRegionOptions,
    getCategoryOptions,
    getRevenueByRegion,
    getOrdersVsSalesByDate,
    getFilteredData,
    getMonthlyConversion,
} from "../../utils/getData";

export function Cards({ records, locations, filters, setFilters }) {
    const monthOptions = useMemo(() => getMonthOptions(), []);
    const cityOptions = useMemo(() => getCityOptions(), []);
    const regionOptions = useMemo(() => getRegionOptions(), []);
    const categoryOptions = useMemo(() => getCategoryOptions(), []);

    const revenueByRegion = useMemo(
        () => getRevenueByRegion(records, locations),
        [records, locations]
    );

    const chartData = useMemo(
        () => getOrdersVsSalesByDate(records),
        [records]
    );

    const conversionChartData = useMemo(() => {
        const filtersWithoutMonth = {
            month: "All",
            city: filters.city,
            region: filters.region,
            category: filters.category,
        };

        const { records: recordsAllMonths } = getFilteredData(filtersWithoutMonth);
        return getMonthlyConversion(recordsAllMonths);
    }, [filters.city, filters.region, filters.category]);

    return (
        <div className="h-full flex flex-col justify-between pb-15">
            <Filters
                monthOptions={monthOptions}
                cityOptions={cityOptions}
                regionOptions={regionOptions}
                categoryOptions={categoryOptions}
                filters={filters}
                setFilters={setFilters}
                onReset={() =>
                    setFilters({ month: "All", city: "All", region: "All", category: "All" })
                }
            />

            <div className="flex justify-between">
                <RevenueByRegionPie data={revenueByRegion} />
                <OrdersVsSalesChart data={chartData} />
            </div>

            <MonthlyConversionChart data={conversionChartData} />

        </div>
    )
}