// client/src/components/Investments/InvestmentForm.js
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  isin: Yup.string()
    .matches(/^[A-Z]{2}[0-9A-Z]{10}$/, 'Invalid ISIN format')
    .required(),
  name: Yup.string().required(),
  type: Yup.string().required(),
});

function InvestmentForm() {
  const formik = useFormik({
    initialValues: { /* ... */ },
    validationSchema,
    onSubmit: (values) => {
      // API call
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="isin"
        label="ISIN"
        error={formik.touched.isin && !!formik.errors.isin}
        helperText={formik.touched.isin && formik.errors.isin}
      />
      {/* Other fields */}
    </form>
  );
}

export default InvestmentForm;