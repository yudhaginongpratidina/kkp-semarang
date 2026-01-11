import { BarChart } from '@mui/x-charts/BarChart';

const dataset = [
    { month: 'Jan', smkhp: 120, laboratorium: 95, customerService: 60 },
    { month: 'Feb', smkhp: 110, laboratorium: 88, customerService: 72 },
    { month: 'Mar', smkhp: 140, laboratorium: 100, customerService: 85 },
    { month: 'Apr', smkhp: 130, laboratorium: 105, customerService: 90 },
    { month: 'May', smkhp: 150, laboratorium: 115, customerService: 95 },
    { month: 'June', smkhp: 170, laboratorium: 130, customerService: 110 },
    { month: 'July', smkhp: 200, laboratorium: 150, customerService: 140 },
    { month: 'Aug', smkhp: 190, laboratorium: 145, customerService: 130 },
    { month: 'Sept', smkhp: 160, laboratorium: 120, customerService: 100 },
    { month: 'Oct', smkhp: 155, laboratorium: 118, customerService: 95 },
    { month: 'Nov', smkhp: 145, laboratorium: 110, customerService: 85 },
    { month: 'Dec', smkhp: 165, laboratorium: 125, customerService: 105 },
];

export default function AnalyticsDashboard() {
    return (
        <div className="w-full p-4">
            <div className="w-full p-4 rounded-sm bg-white">
                <BarChart
                    dataset={dataset}
                    height={400}
                    yAxis={[{ label: 'Total', width: 60 }]}
                    xAxis={[{ dataKey: 'month' }]}
                    series={[
                        {
                            dataKey: 'smkhp',
                            label: 'Layanan SMKHP',
                            valueFormatter: (v) => `${v}`,
                        },
                        {
                            dataKey: 'laboratorium',
                            label: 'Laboratorium',
                            valueFormatter: (v) => `${v}`,
                        },
                        {
                            dataKey: 'customerService',
                            label: 'Customer Service',
                            valueFormatter: (v) => `${v}`,
                        },
                    ]}
                />
            </div>
        </div>
    );
}
