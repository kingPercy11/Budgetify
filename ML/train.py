import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
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
data['Shopping'] = data['Utilities']
data.drop(['Transport'],axis=1,inplace=True)
# data['Shopping'] = data['Shopping']
data['Other'] = data['Miscellaneous'] 
data.drop(['Miscellaneous'],axis=1,inplace=True)
data['Bills'] = data[['Rent','Loan_Repayment','Insurance',]].sum(axis=1)
data.drop(['Rent','Loan_Repayment','Insurance','Utilities'],axis=1,inplace=True)
print(data.info())
# print(data.isna().sum())


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


output_columns = ['Entertainment', 'Shopping', 'Healthcare', 'Education', 
                  'Food & Dining', 'Transportation', 'Other', 'Bills']

# Get input columns (all except output columns)
input_columns = [col for col in data.columns if col not in output_columns]

print(f"\nInput features ({len(input_columns)}): {input_columns}")
print(f"Output variables ({len(output_columns)}): {output_columns}")

# Split into X and y
X = data[input_columns]
y = data[output_columns]

print(f"\nX shape: {X.shape}")
print(f"y shape: {y.shape}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Testing set size: {X_test.shape[0]}")


gb_model = MultiOutputRegressor(GradientBoostingRegressor(n_estimators=100, random_state=42, max_depth=5))

print("\nTraining model...")
gb_model.fit(X_train, y_train)
print("Training complete!")


y_pred = gb_model.predict(X_test)


r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2_per_output = r2_score(y_test, y_pred, multioutput='raw_values')

print("\n" + "="*70)
print("MODEL PERFORMANCE")
print("="*70)
print(f"\nOverall R² Score: {r2:.4f}")
print(f"Mean Absolute Error (MAE): {mae:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")

print(f"\nPer-Output R² Scores:")
for i, col in enumerate(output_columns):
    print(f"  {col}: {r2_per_output[i]:.4f}")

joblib.dump(gb_model, './gradient_boosting_model.pkl')
print("\nGradient Boosting model saved as 'gradient_boosting_model.pkl'")


model_metadata = {
    'input_columns': input_columns,
    'output_columns': output_columns,
    'model_performance': {
        'R2_Score': r2,
        'MAE': mae,
        'RMSE': rmse
    }
}
joblib.dump(model_metadata, './model_metadata.pkl')
print(f"\nModel Performance: R² = {r2:.4f}, MAE = {mae:.4f}, RMSE = {rmse:.4f}")



