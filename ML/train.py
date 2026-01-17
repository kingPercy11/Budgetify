import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import warnings
warnings.filterwarnings('ignore')

data = pd.read_csv('./Data/data.csv')
# print(data.head())
# print(data.describe())
# print(data.info())

data.drop(data.columns[16:],axis=1,inplace=True)
data['Food & Dining'] = data[['Groceries','Eating_Out']].sum(axis=1)
data.drop(['Groceries','Eating_Out'],axis=1,inplace=True)
data['Transportation'] = data['Transport']
data.drop(['Transport'],axis=1,inplace=True)
# data['Shopping'] = data['Shopping']
data['Other'] = data['Miscellaneous'] 
data.drop(['Miscellaneous'],axis=1,inplace=True)
data['Bills & Utilities'] = data[['Rent','Loan_Repayment','Insurance','Utilities']].sum(axis=1)
data.drop(['Rent','Loan_Repayment','Insurance'],axis=1,inplace=True)
print(data.info())
# print(data.isna().sum())

# Identify categorical columns
categorical_cols = data.select_dtypes(include=['object']).columns.tolist()
print(f"\nCategorical columns: {categorical_cols}")

# Encoding categorical variables
if categorical_cols:
    # Option 1: Label Encoding for ordinal/binary categorical variables
    # Good for City_Tier (Tier_1, Tier_2, Tier_3) - has inherent order
    if 'City_Tier' in categorical_cols:
        le_city = LabelEncoder()
        data['City_Tier_Encoded'] = le_city.fit_transform(data['City_Tier'])
        print(f"\nCity_Tier mapping: {dict(zip(le_city.classes_, le_city.transform(le_city.classes_)))}")
        data.drop(['City_Tier'], axis=1, inplace=True)
    
    # Option 2: One-Hot Encoding for nominal categorical variables
    # Good for Occupation (no inherent order between categories)
    if 'Occupation' in categorical_cols:
        occupation_dummies = pd.get_dummies(data['Occupation'], prefix='Occupation', drop_first=True)
        data = pd.concat([data, occupation_dummies], axis=1)
        data.drop(['Occupation'], axis=1, inplace=True)
        print(f"\nOccupation columns created: {occupation_dummies.columns.tolist()}")

print("\n--- Data after encoding ---")
print(data.head())
print(f"\nFinal shape: {data.shape}")
print(f"\nData types:\n{data.dtypes}")

# ============ PREPARE DATA FOR TRAINING ============

print("\n" + "="*70)
print("MODEL TRAINING - MULTI-OUTPUT REGRESSION")
print("="*70)

# Define output columns
output_columns = ['Entertainment', 'Utilities', 'Healthcare', 'Education', 
                  'Food & Dining', 'Transportation', 'Other', 'Bills & Utilities']

# Get input columns (all except output columns)
input_columns = [col for col in data.columns if col not in output_columns]

print(f"\nInput features ({len(input_columns)}): {input_columns}")
print(f"Output variables ({len(output_columns)}): {output_columns}")

# Split into X and y
X = data[input_columns]
y = data[output_columns]

print(f"\nX shape: {X.shape}")
print(f"y shape: {y.shape}")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Testing set size: {X_test.shape[0]}")

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ============ TRAIN MULTIPLE MODELS ============

print("\n" + "="*70)
print("TRAINING MODELS...")
print("="*70)

# Define models
models = {
    'Linear Regression': LinearRegression(),
    'Decision Tree': DecisionTreeRegressor(random_state=42, max_depth=10),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10, n_jobs=-1),
    'Gradient Boosting': MultiOutputRegressor(GradientBoostingRegressor(n_estimators=100, random_state=42, max_depth=5))
}

# Store results
results = []
trained_models = {}

# Train and evaluate each model
for name, model in models.items():
    print(f"\n{'='*70}")
    print(f"Training {name}...")
    print(f"{'='*70}")
    
    # Train model
    if name == 'Linear Regression':
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    
    # Store trained model
    trained_models[name] = model
    
    # Calculate metrics
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    
    # Calculate per-output metrics
    r2_per_output = r2_score(y_test, y_pred, multioutput='raw_values')
    
    print(f"\n{name} Results:")
    print(f"  Overall R² Score: {r2:.4f}")
    print(f"  Mean Absolute Error (MAE): {mae:.4f}")
    print(f"  Root Mean Squared Error (RMSE): {rmse:.4f}")
    
    print(f"\n  Per-Output R² Scores:")
    for i, col in enumerate(output_columns):
        print(f"    {col}: {r2_per_output[i]:.4f}")
    
    # Store results
    results.append({
        'Model': name,
        'R² Score': r2,
        'MAE': mae,
        'RMSE': rmse
    })

# ============ RESULTS COMPARISON ============

print("\n" + "="*70)
print("MODEL COMPARISON")
print("="*70)

results_df = pd.DataFrame(results)
results_df = results_df.sort_values('R² Score', ascending=False)
print("\n", results_df.to_string(index=False))

# Visualize comparison
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# R² Score
axes[0].bar(results_df['Model'], results_df['R² Score'], color='skyblue')
axes[0].set_title('R² Score Comparison', fontsize=14, fontweight='bold')
axes[0].set_ylabel('R² Score')
axes[0].set_ylim([0, 1])
axes[0].tick_params(axis='x', rotation=45)
for i, v in enumerate(results_df['R² Score']):
    axes[0].text(i, v + 0.02, f'{v:.4f}', ha='center', fontweight='bold')

# MAE
axes[1].bar(results_df['Model'], results_df['MAE'], color='lightcoral')
axes[1].set_title('Mean Absolute Error (MAE)', fontsize=14, fontweight='bold')
axes[1].set_ylabel('MAE')
axes[1].tick_params(axis='x', rotation=45)
for i, v in enumerate(results_df['MAE']):
    axes[1].text(i, v + 10, f'{v:.2f}', ha='center', fontweight='bold')

# RMSE
axes[2].bar(results_df['Model'], results_df['RMSE'], color='lightgreen')
axes[2].set_title('Root Mean Squared Error (RMSE)', fontsize=14, fontweight='bold')
axes[2].set_ylabel('RMSE')
axes[2].tick_params(axis='x', rotation=45)
for i, v in enumerate(results_df['RMSE']):
    axes[2].text(i, v + 10, f'{v:.2f}', ha='center', fontweight='bold')

plt.tight_layout()
plt.savefig('./model_comparison.png', dpi=300, bbox_inches='tight')
print("\nModel comparison chart saved as 'model_comparison.png'")
plt.show()

print("\n" + "="*70)
print(f"BEST MODEL: {results_df.iloc[0]['Model']} (R² = {results_df.iloc[0]['R² Score']:.4f})")
print("="*70)

# ============ SAVE GRADIENT BOOSTING MODEL ============

print("\n" + "="*70)
print("SAVING GRADIENT BOOSTING MODEL")
print("="*70)

# Get the Gradient Boosting model
gb_model = trained_models['Gradient Boosting']

# Save the model
joblib.dump(gb_model, './gradient_boosting_model.pkl')
print("\nGradient Boosting model saved as 'gradient_boosting_model.pkl'")

# Save the scaler (not needed for GB since it uses unscaled data, but useful for reference)
joblib.dump(scaler, './scaler.pkl')
print("Scaler saved as 'scaler.pkl'")

# Save input and output column names for future use
model_metadata = {
    'input_columns': input_columns,
    'output_columns': output_columns,
    'model_performance': {
        'R2_Score': results_df[results_df['Model'] == 'Gradient Boosting']['R² Score'].values[0],
        'MAE': results_df[results_df['Model'] == 'Gradient Boosting']['MAE'].values[0],
        'RMSE': results_df[results_df['Model'] == 'Gradient Boosting']['RMSE'].values[0]
    }
}
joblib.dump(model_metadata, './model_metadata.pkl')
print("Model metadata saved as 'model_metadata.pkl'")

print("\n" + "="*70)
print("MODEL SAVED SUCCESSFULLY!")
print("="*70)
print("\nTo load the model later:")
print("  model = joblib.load('gradient_boosting_model.pkl')")
print("  metadata = joblib.load('model_metadata.pkl')")
print("\nTo make predictions:")
print("  predictions = model.predict(new_data)")

