import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentGeneratorForm } from './DocumentGeneratorForm';
import { DocumentGenerator } from '@/lib/documentGenerator';
import { useToast } from "@/components/ui/use-toast";
import { UseToastReturn } from '@/components/ui/use-toast';

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

// Mock the DocumentGenerator class
jest.mock('@/lib/documentGenerator', () => ({
    DocumentGenerator: jest.fn(() => ({
        generateAllDocuments: jest.fn().mockResolvedValue({
            requirements: 'Mock requirements document',
            architecture: 'Mock architecture document',
        }),
    })),
}));

describe('DocumentGeneratorForm', () => {
    it('renders the form', () => {
        render(<DocumentGeneratorForm />);
        expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Generate Documentation' })).toBeInTheDocument();
    });

    it('allows filling out the form and submits data', async () => {
        const mockToast = useToast() as jest.Mocked<UseToastReturn>;
        const mockDocumentGenerator = new DocumentGenerator();
        render(<DocumentGeneratorForm documentGenerator={mockDocumentGenerator} />);


        fireEvent.change(screen.getByLabelText('Project Name'), { target: { value: 'Test Project' } });
        fireEvent.change(screen.getByLabelText('Project Description'), { target: { value: 'Test description' } });
        fireEvent.change(screen.getByLabelText('Target Audience'), { target: { value: 'Test audience' } });
        fireEvent.change(screen.getByLabelText('Key Features'), { target: { value: 'Test features' } });
        fireEvent.change(screen.getByLabelText('Business Goals'), { target: { value: 'Test goals' } });

        fireEvent.click(screen.getByRole('button', { name: 'Generate Documentation' }));

        await waitFor(() => {
            expect(mockDocumentGenerator.generateAllDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentGenerator.generateAllDocuments).toHaveBeenCalledWith(expect.objectContaining({
              projectName: 'Test Project',
              description: 'Test description',
              targetAudience: 'Test audience',
              keyFeatures: 'Test features',
              businessGoals: 'Test goals',
            }));
          });

        await waitFor(() => {
            expect(mockToast.toast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Documents Generated Successfully',
                description: 'Documentation for project "Test Project" has been created.',
            }));
        });


        expect(screen.getByText('Mock requirements document')).toBeInTheDocument();
        expect(screen.getByText('Mock architecture document')).toBeInTheDocument();
    });
    it('displays an error toast when document generation fails', async () => {
        const mockToast = useToast() as jest.Mocked<UseToastReturn>;
        const mockDocumentGenerator = new DocumentGenerator();
         (mockDocumentGenerator.generateAllDocuments as jest.Mock).mockRejectedValue(new Error('Test Error'));

        render(<DocumentGeneratorForm documentGenerator={mockDocumentGenerator} />);

        fireEvent.change(screen.getByLabelText('Project Name'), { target: { value: 'Test Project' } });
        fireEvent.change(screen.getByLabelText('Project Description'), { target: { value: 'Test description' } });
        fireEvent.change(screen.getByLabelText('Target Audience'), { target: { value: 'Test audience' } });
        fireEvent.change(screen.getByLabelText('Key Features'), { target: { value: 'Test features' } });
        fireEvent.change(screen.getByLabelText('Business Goals'), { target: { value: 'Test goals' } });

        fireEvent.click(screen.getByRole('button', { name: 'Generate Documentation' }));

         await waitFor(() => {
            expect(mockToast.toast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Error',
                description: 'Failed to generate documents. Please try again.',
                variant: 'destructive',
            }));
        });
    });
     it('does not submit if project name is too short', async () => {
        const mockDocumentGenerator = new DocumentGenerator();
        render(<DocumentGeneratorForm documentGenerator={mockDocumentGenerator} />);
        fireEvent.change(screen.getByLabelText('Project Name'), { target: { value: 'T' } });
         fireEvent.click(screen.getByRole('button', { name: 'Generate Documentation' }));
         await waitFor(() => {
           expect(mockDocumentGenerator.generateAllDocuments).not.toHaveBeenCalled()
         })
      });
});