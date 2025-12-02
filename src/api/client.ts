const BASE_URL = 'http://localhost:8000';

export type ApiGoal = 'hypertrophy' | 'strength' | 'fat_loss';
export type ApiExperience = 'beginner' | 'intermediate' | 'advanced';

export interface ProgramInitRequest {
  goal: ApiGoal;
  experience: ApiExperience;
  equipment: string[];
  lifts?: Record<string, number>;
}

export interface ProgramInitResponse {
  id: string;
  split: string;
  program_json: {
    split: string;
    days: {
      day: string;
      exercises: { id: string; sets: number; reps: string; target_weight: number }[];
    }[];
    generated_at: string;
  };
  created_at: string;
}

export interface TodayWorkoutResponse {
  day: string;
  workout_id?: string;
  exercises: { id: string; sets: number; reps: string; target_weight: number; name?: string }[];
}

export interface UpdateWorkoutRequest {
  day: string;
  changes: { exercise_id: string; action: 'swap'; new_exercise: string }[];
}

export interface UpdateWorkoutResponse {
  status: string;
  changes: { exercise_id: string; action: 'swap'; new_exercise: string }[];
  preferences?: Record<string, string>;
}

export interface LogWorkoutRequest {
  workout_id: string;
  exercise_id: string;
  actual_weight: number | null;
  target_weight: number | null;
  sets: number;
  reps: string;
  completed: boolean;
}

export interface LogWorkoutResponse {
  status: string;
  log_id?: string;
}

export interface FinishWorkoutResponse {
  message?: string;
  progress?: Record<string, string> | null;
}

export type HistoryResponse = Record<string, { date: string; weight: number }[]>;

export interface ExerciseGuideRequest {
  exercise_name?: string;
  image_url?: string | null;
}

export interface ExerciseGuideResponse {
  muscles: string[];
  steps: string[];
  mistakes: string[];
  metadata?: Record<string, unknown>;
}

class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const getAuthToken = () => process.env.EXPO_PUBLIC_API_TOKEN || 'demo-token';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(typeof body === 'string' ? body : body?.message || 'Request failed', response.status, body);
  }

  return body as T;
}

export const apiClient = {
  initializeProgram: (payload: ProgramInitRequest) =>
    request<ProgramInitResponse>('/api/program/init', { method: 'POST', body: JSON.stringify(payload) }),
  getTodaysWorkout: () => request<TodayWorkoutResponse>('/api/workout/today'),
  updateWorkout: (payload: UpdateWorkoutRequest) =>
    request<UpdateWorkoutResponse>('/api/workout/update', { method: 'PATCH', body: JSON.stringify(payload) }),
  logWorkout: (payload: LogWorkoutRequest) =>
    request<LogWorkoutResponse>('/api/workout/log', { method: 'POST', body: JSON.stringify(payload) }),
  finishWorkout: (workoutId: string) => request<FinishWorkoutResponse>(`/api/workout/finish?workout_id=${workoutId}`, { method: 'POST' }),
  getHistory: (exerciseId: string) => request<HistoryResponse>(`/api/history?exercise_id=${encodeURIComponent(exerciseId)}`),
  getExerciseGuide: (payload: ExerciseGuideRequest) =>
    request<ExerciseGuideResponse>('/api/exercise/guide', { method: 'POST', body: JSON.stringify(payload) }),
};

export { ApiError };
