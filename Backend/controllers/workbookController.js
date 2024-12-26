const Workbook = require('../models/Workbook');

// Get all workbooks
exports.getWorkbooks = async (req, res, next) => {
    try {
        console.log('Fetching workbooks...');
        const workbooks = await Workbook.find();
        console.log('Found workbooks:', workbooks);
        
        res.status(200).json({
            success: true,
            count: workbooks.length,
            data: workbooks
        });
    } catch (error) {
        console.error('Error fetching workbooks:', error);
        next(error);
    }
};

// Create workbook
exports.createWorkbook = async (req, res, next) => {
    try {
        console.log('Creating workbook with data:', req.body);
        
        // Handle image upload if present
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        const workbook = await Workbook.create(req.body);
        console.log('Created workbook:', workbook);

        res.status(201).json({
            success: true,
            data: workbook
        });
    } catch (error) {
        console.error('Error creating workbook:', error);
        next(error);
    }
};

// Update workbook
exports.updateWorkbook = async (req, res, next) => {
    try {
        console.log('Updating workbook:', req.params.id);
        console.log('Update data:', req.body);

        const workbook = await Workbook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!workbook) {
            return res.status(404).json({
                success: false,
                message: 'Workbook not found'
            });
        }

        console.log('Updated workbook:', workbook);
        res.status(200).json({
            success: true,
            data: workbook
        });
    } catch (error) {
        console.error('Error updating workbook:', error);
        next(error);
    }
};

// Delete workbook
exports.deleteWorkbook = async (req, res, next) => {
    try {
        console.log('Deleting workbook:', req.params.id);
        const workbook = await Workbook.findById(req.params.id);

        if (!workbook) {
            return res.status(404).json({
                success: false,
                message: 'Workbook not found'
            });
        }

        await workbook.deleteOne();
        console.log('Workbook deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Workbook deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting workbook:', error);
        next(error);
    }
}; 