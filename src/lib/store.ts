import { create } from 'zustand';
import { RetirementInputs, defaultInputs } from '@/types/inputs';
import { CalculationResults } from '@/types/results';
import { calculateDeterministic } from '@/lib/finance/deterministic';
import { runMonteCarloSimulation } from '@/lib/finance/mc';

interface CalculatorState {
  inputs: RetirementInputs;
  results: CalculationResults | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateInputs: (updates: Partial<RetirementInputs>) => void;
  resetInputs: () => void;
  calculate: () => Promise<void>;
  clearResults: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  inputs: defaultInputs,
  results: null,
  isLoading: false,
  error: null,

  updateInputs: (updates) => {
    set((state) => ({
      inputs: { ...state.inputs, ...updates },
    }));
  },

  resetInputs: () => {
    set({ inputs: defaultInputs, results: null, error: null });
  },

  calculate: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { inputs } = get();
      
      // Run deterministic calculation
      const deterministic = calculateDeterministic(inputs);
      
      // Run Monte Carlo simulation
      const { results: allPaths, summary: monteCarlo } = runMonteCarloSimulation(inputs);
      
      const results: CalculationResults = {
        deterministic,
        monteCarlo,
        allPaths,
      };
      
      set({ results, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred during calculation',
        isLoading: false 
      });
    }
  },

  clearResults: () => {
    set({ results: null, error: null });
  },
})); 