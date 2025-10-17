import React, { useState, ChangeEvent, useEffect } from 'react';
import { SparklesIcon, FileTextIcon, Loader2Icon, CalendarClockIcon, DownloadIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { mrrData, clientProfitabilityData, salesPipelineData, detailedClientData } from '../constants';
import MrrChart from './MrrChart';
import ProfitabilityTable from './ProfitabilityTable';
import SalesPipeline from './SalesPipeline';
import { MrrData, ClientProfitability, SalesPipelineStage } from '../types';

interface ReportData {
  mrr?: MrrData[];
  clients?: ClientProfitability[];
  sales?: SalesPipelineStage[];
}

const CheckboxWithTooltip: React.FC<{
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  tooltipText: string;
}> = ({ id, label, name, checked, onChange, tooltipText }) => (
  <div className="relative group flex">
    <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded bg-white/10 border-white/20 text-[#7F56D9] focus:ring-[#7F56D9] focus:ring-offset-[#120f2e]"
      />
      <span className="text-white font-medium">{label}</span>
    </label>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-sm text-center text-white bg-[#120f2e] border border-white/10 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
      {tooltipText}
    </div>
  </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; }> = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
        enabled ? 'bg-gradient-to-r from-[#7F56D9] to-[#9E77ED]' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
);


const ReportingPage: React.FC = () => {
  const [reportParams, setReportParams] = useState({
    includeMrr: true,
    includeClients: true,
    includeSales: false,
    startDate: '',
    endDate: '',
    isScheduled: false,
    frequency: 'weekly',
    time: '09:00',
    email: 'manager@msp.com',
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState<string | null>(null);

  const [historicalDate, setHistoricalDate] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('Generated Report');
  const [isLoadingHistorical, setIsLoadingHistorical] = useState<boolean>(false);
  
  useEffect(() => {
    if (reportParams.startDate && reportParams.endDate) {
      if (new Date(reportParams.startDate) > new Date(reportParams.endDate)) {
        setDateError('Start date cannot be after end date.');
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }
  }, [reportParams.startDate, reportParams.endDate]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setReportParams(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setReportParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleScheduleReport = () => {
    setScheduleStatus(`Report scheduled! It will be sent ${reportParams.frequency} at ${reportParams.time} to ${reportParams.email}.`);
    setTimeout(() => {
        setScheduleStatus(null);
    }, 5000); // Hide message after 5 seconds
  };

  const handleGenerateReport = () => {
    if (dateError) return;
    setIsGeneratingReport(true);
    // Use a short timeout to allow the UI to update to the loading state
    setTimeout(() => {
        const data: ReportData = {};
        if (reportParams.includeMrr) data.mrr = mrrData;
        if (reportParams.includeClients) {
          let clients = clientProfitabilityData;
          if (reportParams.startDate && reportParams.endDate) {
            const clientJoinDates = new Map(detailedClientData.map(c => [c.id, new Date(c.joinDate)]));
            const startDate = new Date(reportParams.startDate);
            const endDate = new Date(reportParams.endDate);
            endDate.setHours(23, 59, 59, 999); // Ensure end date is inclusive

            clients = clients.filter(c => {
              const joinDate = clientJoinDates.get(c.id);
              return joinDate && joinDate >= startDate && joinDate <= endDate;
            });
          }
          data.clients = clients;
        }
        if (reportParams.includeSales) data.sales = salesPipelineData;
        
        setReportData(data);
        setReportTitle('Generated Report');
        setSummary(null);
        setSummaryError(null);
        setIsGeneratingReport(false);
    }, 500);
  };

  const handleLoadHistoricalReport = () => {
    if (!historicalDate) return;
    setIsLoadingHistorical(true);
    // Simulate API call
    setTimeout(() => {
        const historicalData: ReportData = {
            mrr: mrrData.map(d => ({...d, mrr: Math.round(d.mrr * (0.9 + Math.random() * 0.1)) })),
            clients: clientProfitabilityData.slice(0, 4).map(c => ({...c, margin: Math.round(c.margin * (0.9 + Math.random() * 0.1))})),
            sales: salesPipelineData.map(s => ({...s, value: Math.round(s.value * 0.95)})),
        };
        setReportData(historicalData);
        setReportTitle(`Report for ${historicalDate}`);
        setSummary(null);
        setSummaryError(null);
        setIsLoadingHistorical(false);
    }, 1000);
  };


  const handleExportReport = () => {
    if (!reportData) return;

    let csvContent = "";

    // Helper to escape CSV fields
    const escapeCsvField = (field: any): string => {
        const stringField = String(field);
        if (stringField.includes(',')) {
            return `"${stringField}"`;
        }
        return stringField;
    };

    if (reportData.mrr && reportData.mrr.length > 0) {
        csvContent += "MRR Growth\n";
        csvContent += "Month,MRR\n";
        reportData.mrr.forEach(row => {
            csvContent += `${row.month},${row.mrr}\n`;
        });
        csvContent += "\n";
    }

    if (reportData.clients && reportData.clients.length > 0) {
        csvContent += "Client-Level Profitability\n";
        csvContent += "Client,Profit Margin,Churn Risk,Lifetime Value (LTV)\n";
        reportData.clients.forEach(row => {
            csvContent += `${escapeCsvField(row.client)},${row.margin},${row.churnRisk},${row.ltv}\n`;
        });
        csvContent += "\n";
    }

    if (reportData.sales && reportData.sales.length > 0) {
        csvContent += "Sales Pipeline\n";
        csvContent += "Stage,Value,Deal Count\n";
        reportData.sales.forEach(row => {
            csvContent += `${row.stage},${row.value},${row.dealCount}\n`;
        });
        csvContent += "\n";
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `ProfitCatalyst_Report_${timestamp}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const generateSummary = async () => {
    if (!reportData) return;

    setLoadingSummary(true);
    setSummaryError(null);
    setSummary(null);

    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
      setSummaryError("API_KEY is not configured. Please ensure the environment variable is set.");
      setLoadingSummary(false);
      return;
    }

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let dataForPrompt = "Here is the data for the custom report:\n";
      if (reportData.mrr) dataForPrompt += `\nMonthly Recurring Revenue (MRR) Data: ${JSON.stringify(reportData.mrr)}\n`;
      if (reportData.clients) dataForPrompt += `\nClient Profitability Data: ${JSON.stringify(reportData.clients)}\n`;
      if (reportData.sales) dataForPrompt += `\nSales Pipeline Data: ${JSON.stringify(reportData.sales)}\n`;

      const prompt = `
        You are an expert business analyst for a Managed Service Provider (MSP).
        Analyze the following custom report data. Provide a concise yet insightful summary that highlights:
        1. Key Findings: What are the most important takeaways from the data?
        2. Significant Trends: Are there any noticeable upward or downward trends?
        3. Actionable Insights: Suggest 1-2 specific, data-driven actions the business should consider.

        Present the summary in clear, easy-to-understand language for a manager. Use markdown for formatting (e.g., bolding, bullet points).

        ${dataForPrompt}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setSummary(response.text);

    } catch (e: any) {
      console.error("Error generating summary:", e);
      setSummaryError(e.message || "An unknown error occurred while generating the summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const inputClasses = "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#7F56D9] focus:border-[#7F56D9] w-full disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Advanced Analytics & Reporting</h1>

      <div className="glassmorphic rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FileTextIcon className="w-5 h-5 mr-3 text-[#7F56D9]" />
          Custom Report Builder
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <CheckboxWithTooltip 
            id="includeMrr" 
            label="MRR Growth" 
            name="includeMrr" 
            checked={reportParams.includeMrr} 
            onChange={handleCheckboxChange} 
            tooltipText="Includes a chart showing the Monthly Recurring Revenue trend over the last several months."
          />
          <CheckboxWithTooltip 
            id="includeClients" 
            label="Client Profitability" 
            name="includeClients" 
            checked={reportParams.includeClients} 
            onChange={handleCheckboxChange}
            tooltipText="Includes a detailed table of your clients, their profit margins, churn risk, and lifetime value."
          />
          <CheckboxWithTooltip 
            id="includeSales" 
            label="Sales Pipeline" 
            name="includeSales" 
            checked={reportParams.includeSales} 
            onChange={handleCheckboxChange} 
            tooltipText="Includes a visual representation of your current sales pipeline stages from HubSpot."
          />
        </div>

        <div className="border-t border-white/10 pt-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
                Filter by Client Join Date (Optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                    type="date"
                    name="startDate"
                    value={reportParams.startDate}
                    onChange={handleInputChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#7F56D9] focus:border-[#7F56D9] w-full sm:w-auto"
                />
                <span className="text-gray-400">to</span>
                <input
                    type="date"
                    name="endDate"
                    value={reportParams.endDate}
                    onChange={handleInputChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#7F56D9] focus:border-[#7F56D9] w-full sm:w-auto"
                />
            </div>
            {dateError && <p className="text-red-500 text-xs mt-2">{dateError}</p>}
        </div>

        <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport || !!dateError}
              className="bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingReport ? (
                  <>
                    <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
              ) : (
                  'Generate Report'
              )}
            </button>
            <button
                onClick={handleExportReport}
                disabled={!reportData}
                className="bg-transparent border border-[#7F56D9] text-[#7F56D9] px-6 py-2 rounded-lg font-semibold hover:bg-[#7F56D9]/20 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Export Report
            </button>
        </div>
        
        <div className="border-t border-white/10 mt-6 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CalendarClockIcon className="w-5 h-5 mr-3 text-[#7F56D9]" />
                Schedule Automatic Reports
            </h3>
            <div className="flex items-center space-x-4 mb-4">
                <ToggleSwitch 
                    enabled={reportParams.isScheduled} 
                    onChange={() => setReportParams(p => ({...p, isScheduled: !p.isScheduled}))} 
                />
                <span className="text-white font-medium">Enable Scheduling</span>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity ${reportParams.isScheduled ? 'opacity-100' : 'opacity-50'}`}>
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                    <select
                        id="frequency"
                        name="frequency"
                        value={reportParams.frequency}
                        onChange={handleInputChange}
                        disabled={!reportParams.isScheduled}
                        className={inputClasses}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={reportParams.time}
                        onChange={handleInputChange}
                        disabled={!reportParams.isScheduled}
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Recipient Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="e.g., manager@msp.com"
                        value={reportParams.email}
                        onChange={handleInputChange}
                        disabled={!reportParams.isScheduled}
                        className={inputClasses}
                    />
                </div>
            </div>
             <div className="mt-6">
                <button
                    onClick={handleScheduleReport}
                    disabled={!reportParams.isScheduled || !reportParams.email}
                    className="bg-transparent border border-[#7F56D9] text-[#7F56D9] px-6 py-2 rounded-lg font-semibold hover:bg-[#7F56D9]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Schedule Report
                </button>
            </div>
            {scheduleStatus && (
                <div className="mt-4 p-3 text-center text-sm text-green-300 bg-green-500/20 rounded-lg animate-fade-in">
                    {scheduleStatus}
                </div>
            )}
        </div>
      </div>

      <div className="glassmorphic rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CalendarClockIcon className="w-5 h-5 mr-3 text-[#7F56D9]" />
            View Historical Reports
        </h2>
        <p className="text-sm text-gray-400 mb-4">Select a date to load and view a previously generated report.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
                type="date"
                value={historicalDate}
                onChange={(e) => setHistoricalDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#7F56D9] focus:border-[#7F56D9] w-full sm:w-auto"
            />
            <button
                onClick={handleLoadHistoricalReport}
                disabled={!historicalDate || isLoadingHistorical}
                className="bg-transparent border border-[#7F56D9] text-[#7F56D9] px-6 py-2 rounded-lg font-semibold hover:bg-[#7F56D9]/20 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
                {isLoadingHistorical ? (
                    <>
                        <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                        Loading...
                    </>
                ) : (
                    'Load Report'
                )}
            </button>
        </div>
      </div>

      {reportData && (
        <div className="glassmorphic rounded-2xl p-6 space-y-8 animate-fade-in">
          <h2 className="text-xl font-semibold text-white">{reportTitle}</h2>
          {reportData.mrr && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">MRR Growth</h3>
              <MrrChart data={reportData.mrr} />
            </div>
          )}
          {reportData.clients && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Client-Level Profitability</h3>
              {reportData.clients.length > 0 ? (
                <ProfitabilityTable data={reportData.clients} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No client data found for the selected date range.
                </div>
              )}
            </div>
          )}
          {reportData.sales && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Sales Pipeline</h3>
              <SalesPipeline data={reportData.sales} loading={false} />
            </div>
          )}
          
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <h3 className="flex items-center text-lg font-semibold text-white">
                <SparklesIcon className="w-5 h-5 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-[#7F56D9] to-[#9E77ED]" />
                AI-Powered Summary
              </h3>
              <button
                onClick={generateSummary}
                disabled={loadingSummary}
                className="bg-[#7F56D9]/20 text-[#9E77ED] px-4 py-2 rounded-lg font-semibold hover:bg-[#7F56D9]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:w-auto w-full"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                {loadingSummary ? 'Generating...' : 'Generate Summary'}
              </button>
            </div>
            {loadingSummary && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
            {summaryError && <p className="text-red-400 text-center p-4">{summaryError}</p>}
            {summary && (
              <div
                className="prose prose-invert prose-sm max-w-none text-gray-300 bg-white/5 p-4 rounded-lg"
                dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingPage;