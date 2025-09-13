
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import IndianFieldDetail from '../components/IndianFieldDetail';
import usePageMetadata from '../hooks/use-page-metadata';

const ParcelsDetailsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Field Management in India',
    defaultDescription: 'Manage, monitor and optimize your agricultural fields across all regions'
  });

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
        />

        <IndianFieldDetail />
      </div>
    </PageLayout>
  );
};

export default ParcelsDetailsPage;
