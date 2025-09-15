
import { useState } from 'react';
import { useSupabaseCRM } from '../../contexts/SupabaseCRMContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { generatePreviewHTML } from '@/utils/preview-generator';
import { toast } from 'sonner';

interface UsePreviewActionsProps {
  data: any[];
  moduleName: string;
  columns?: { key: string, header: string }[];
  title?: string;
}

export const usePreviewActions = ({ 
  data, 
  moduleName, 
  columns, 
  title 
}: UsePreviewActionsProps) => {
  // Note: functions not yet implemented in Supabase context
  // const { ... } = useSupabaseCRM();
  const { settings } = useAppSettings();
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');

  const handlePrint = async () => {
    if (!data || data.length === 0) {
      toast.error("No data to print", {
        description: "Please check your filters or select another period."
      });
      return;
    }

    setIsActionInProgress(true);
    
    try {
      await printModuleData(moduleName, {
        columns: columns,
        title: title || `Overview - ${moduleName}`
      });
      toast.success("Document sent to printer", {
        description: "Your document has been sent to the printer."
      });
    } catch (error) {
      console.error("Error during printing:", error);
      toast.error("Printing Error", {
        description: "An error occurred during document printing."
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleShowPreview = () => {
    if (!data || data.length === 0) {
      toast.error("No data to display", {
        description: "Please check your filters or select another period."
      });
      return;
    }
    
    const html = generatePreviewHTML(data, moduleName, title, columns, settings.locale);
    setPreviewHTML(html);
    setPreviewOpen(true);
  };

  const handleExportPDF = async () => {
    if (!data || data.length === 0) {
      toast.error("No data to export", {
        description: "Please check your filters or select another period."
      });
      return;
    }

    setIsActionInProgress(true);
    
    try {
      await exportModuleData(moduleName, 'pdf', data, {
        title: title || `Report - ${moduleName}`,
        columns: columns
      });
      toast.success("PDF generated successfully", {
        description: "The document has been downloaded."
      });
    } catch (error) {
      console.error("Error during PDF generation:", error);
      toast.error("Export Error", {
        description: "An error occurred during PDF generation."
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  return {
    isActionInProgress,
    previewOpen,
    setPreviewOpen,
    previewHTML,
    handlePrint,
    handleShowPreview,
    handleExportPDF
  };
};
