import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FinancialDashboard = () => {
  const [projections, setProjections] = useState({
    2025: {
      services: {
        'COMPLETE ENTREPRENEUR BUNDLE': { clients: 10, ratePerClient: 26750 },
        'STANDARD SME BUNDLE': { clients: 15, ratePerClient: 35750 },
        'REAL ESTATE BUNDLE': { clients: 2, ratePerClient: 17750 },
        'BUSINESS ONLY': { clients: 2, ratePerClient: 17750 },
        'BUSINESS & REAL ESTATE': { clients: 4, ratePerClient: 27750 }
      },
      expenses: {
        fixed: {
          'Staff Salaries': 135000,
          'Property Maintenance': 6000,
          'IT Infrastructure': 10000,
          'RAG AI Development': 1000,
          'Administrative': 10000
        },
        variable: {
          'B2B Partner Share': 190900,
          'Marketing': 14318,
          'Professional Services': 9545,
          'Travel': 23863,
          'Compliance': 11931
        }
      },
      targetMargin: 15
    },
    2027: {
      services: {
        'COMPLETE ENTREPRENEUR BUNDLE': { clients: 20, ratePerClient: 28500 },
        'STANDARD SME BUNDLE': { clients: 20, ratePerClient: 37500 },
        'REAL ESTATE BUNDLE': { clients: 3, ratePerClient: 19000 },
        'BUSINESS ONLY': { clients: 2, ratePerClient: 19000 },
        'BUSINESS & REAL ESTATE': { clients: 5, ratePerClient: 29000 }
      },
      expenses: {
        fixed: {
          'Staff Salaries': 270000,
          'Property Maintenance': 7200,
          'IT Infrastructure': 15000,
          'RAG AI Development': 3000,
          'Administrative': 26400
        },
        variable: {
          'B2B Partner Share': 300000,
          'Marketing': 22500,
          'Professional Services': 15000,
          'Travel': 37500,
          'Compliance': 18750
        }
      },
      targetMargin: 45
    }
  });

  const calculateMetrics = (year) => {
    const yearData = projections[year];
    const revenue = Object.values(yearData.services).reduce(
      (acc, service) => acc + (service.clients * service.ratePerClient), 0
    );
    const fixedExpenses = Object.values(yearData.expenses.fixed).reduce((a, b) => a + b, 0);
    const variableExpenses = Object.values(yearData.expenses.variable).reduce((a, b) => a + b, 0);
    const totalExpenses = fixedExpenses + variableExpenses;
    const profit = revenue - totalExpenses;
    const actualMargin = (profit / revenue) * 100;

    return {
      revenue,
      expenses: totalExpenses,
      profit,
      margin: actualMargin
    };
  };

  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const newMetrics = {};
    Object.keys(projections).forEach(year => {
      newMetrics[year] = calculateMetrics(year);
    });
    setMetrics(newMetrics);
  }, [projections]);

  return (
    <div className="w-full space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>SUO Global Financial Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="h-96">
              <LineChart
                width={500}
                height={300}
                data={Object.entries(metrics).map(([year, data]) => ({
                  year,
                  revenue: data.revenue,
                  profit: data.profit
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
              </LineChart>
            </div>

            {/* KPI Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Metric</th>
                    {Object.keys(metrics).map(year => (
                      <th key={year} className="p-2 text-right">{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b">Revenue (€)</td>
                    {Object.entries(metrics).map(([year, data]) => (
                      <td key={year} className="p-2 border-b text-right">
                        {data.revenue.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Operating Margin (%)</td>
                    {Object.entries(metrics).map(([year, data]) => (
                      <td key={year} className="p-2 border-b text-right">
                        {data.margin.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Net Profit (€)</td>
                    {Object.entries(metrics).map(([year, data]) => (
                      <td key={year} className="p-2 border-b text-right">
                        {data.profit.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
