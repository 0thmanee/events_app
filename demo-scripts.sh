#!/bin/bash

# Demo Data Management Scripts for 1337 Events
# ===========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -d "back_end_app" ]; then
        print_error "Please run this script from the project root directory"
        print_info "Expected structure: back_end_app/, front_end/, etc."
        exit 1
    fi
}

# Check if Node.js and npm are installed
check_dependencies() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Function to populate demo data
populate_demo_data() {
    print_header "Populating Demo Data"
    
    print_info "This will create realistic demo data including:"
    echo "  👥 13 Demo users with profile pictures"
    echo "  📅 8 Events in various states (upcoming/completed)"
    echo "  🎯 Realistic attendee and feedback data"
    echo "  🔔 Sample notifications"
    echo "  💰 Varying user levels and wallets"
    echo ""
    
    print_warning "Make sure your MongoDB database is running!"
    echo ""
    
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting demo data population..."
        cd back_end_app
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            print_info "Installing backend dependencies..."
            npm install
        fi
        
        # Run the population script
        node scripts/populate-demo-data.js
        
        if [ $? -eq 0 ]; then
            print_success "Demo data populated successfully!"
            echo ""
            print_info "You can now:"
            echo "  🚀 Start the backend: cd back_end_app && npm run dev"
            echo "  📱 Start the frontend: cd front_end && npm start"
            echo "  🌐 Test in your app or browser"
        else
            print_error "Failed to populate demo data. Check the error messages above."
        fi
        
        cd ..
    else
        print_info "Demo data population cancelled."
    fi
}

# Function to clean up demo data
cleanup_demo_data() {
    print_header "Cleaning Up Demo Data"
    
    print_warning "This will delete ALL demo data from your database!"
    print_info "The script will preserve any real users (non-demo accounts)"
    echo ""
    echo "🗑️  Will delete:"
    echo "  📅 ALL events"
    echo "  👥 ALL demo users (preserving real users)"
    echo "  🔔 ALL notifications"
    echo "  🎨 ALL customization requests"
    echo ""
    
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting demo data cleanup..."
        cd back_end_app
        
        # Run the cleanup script
        node scripts/cleanup-demo-data.js
        
        if [ $? -eq 0 ]; then
            print_success "Demo data cleaned up successfully!"
            echo ""
            print_info "Your database is now clean and ready for fresh data."
        else
            print_error "Failed to clean up demo data. Check the error messages above."
        fi
        
        cd ..
    else
        print_info "Demo data cleanup cancelled."
    fi
}

# Function to reset database completely
reset_database() {
    print_header "Complete Database Reset"
    
    print_error "🚨 DANGER: This will COMPLETELY WIPE your database!"
    print_warning "This action cannot be undone!"
    echo ""
    echo "🗑️  Will delete:"
    echo "  📅 ALL events"
    echo "  👥 ALL users (except preserved real users)"
    echo "  🔔 ALL notifications"
    echo "  🎨 ALL customization requests"
    echo "  📊 ALL analytics data"
    echo ""
    
    read -p "Type 'RESET' to confirm complete database wipe: " confirm
    
    if [ "$confirm" = "RESET" ]; then
        print_info "Performing complete database reset..."
        cd back_end_app
        
        # Run the cleanup script in reset mode
        node scripts/cleanup-demo-data.js --reset
        
        if [ $? -eq 0 ]; then
            print_success "Database reset completed!"
            echo ""
            print_info "Your database is now completely clean."
        else
            print_error "Failed to reset database. Check the error messages above."
        fi
        
        cd ..
    else
        print_info "Database reset cancelled."
    fi
}

# Function to show database status
show_status() {
    print_header "Database Status"
    
    cd back_end_app
    
    # Create a simple status check script
    cat > /tmp/db_status.js << 'EOF'
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Event = require('./src/models/Event');
const Notification = require('./src/models/Notification');

async function showStatus() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
    await mongoose.connect(mongoUri);
    
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const notificationCount = await Notification.countDocuments();
    
    console.log('📊 Current Database Status:');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📅 Events: ${eventCount}`);
    console.log(`   🔔 Notifications: ${notificationCount}`);
    
    if (userCount > 0) {
      console.log('\n👥 User Breakdown:');
      const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      usersByRole.forEach(role => {
        console.log(`   ${role._id}: ${role.count}`);
      });
    }
    
    if (eventCount > 0) {
      console.log('\n📅 Event Breakdown:');
      const eventsByStatus = await Event.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      eventsByStatus.forEach(status => {
        console.log(`   ${status._id}: ${status.count}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking database status:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

showStatus();
EOF
    
    # Run the status check
    node /tmp/db_status.js
    rm /tmp/db_status.js
    
    cd ..
}

# Main menu
show_menu() {
    clear
    print_header "1337 Events - Demo Data Management"
    
    echo "Choose an option:"
    echo ""
    echo "1) 📊 Show database status"
    echo "2) 🎯 Populate demo data"
    echo "3) 🧹 Clean up demo data" 
    echo "4) 🚨 Reset database completely"
    echo "5) ❌ Exit"
    echo ""
}

# Main script logic
main() {
    check_directory
    check_dependencies
    
    while true; do
        show_menu
        read -p "Enter your choice (1-5): " choice
        echo ""
        
        case $choice in
            1)
                show_status
                echo ""
                read -p "Press Enter to continue..."
                ;;
            2)
                populate_demo_data
                echo ""
                read -p "Press Enter to continue..."
                ;;
            3)
                cleanup_demo_data
                echo ""
                read -p "Press Enter to continue..."
                ;;
            4)
                reset_database
                echo ""
                read -p "Press Enter to continue..."
                ;;
            5)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-5."
                sleep 2
                ;;
        esac
    done
}

# Run the main function
main 