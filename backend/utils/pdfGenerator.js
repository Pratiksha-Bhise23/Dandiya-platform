const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateTicketPDF = (ticketData) => {
  return new Promise((resolve, reject) => {
    try {
      const { name, date, pass_type, qrCode, email } = ticketData;

      const doc = new PDFDocument({
        size: [400, 600], // Custom size similar to the reference image
        margin: 0,
      });

      const fileName = `ticket-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "..", "tickets", fileName);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Background
      doc.rect(0, 0, 400, 600).fill("#f5f5f5");

      // White ticket background
      doc.rect(20, 20, 360, 560).fill("#ffffff");

      // Header section - Add Malang logo/image space
      const logoPath = path.join(__dirname, "..", "assets", "malang-logo.png");

      try {
        if (fs.existsSync(logoPath)) {
          // Center the logo
          doc.image(logoPath, 150, 40, {
            width: 100,
            height: 100,
          });
        } else {
          // Fallback text if logo not found
          doc
            .fontSize(16)
            .fillColor("#1f5582")
            .font("Helvetica-Bold")
            .text("Malang", 50, 50, { width: 300, align: "center" });

          doc
            .fontSize(14)
            .fillColor("#d91e7a")
            .font("Helvetica-Bold")
            .text("रास गार्डिया", 50, 75, { width: 300, align: "center" });
        }
      } catch (error) {
        // Fallback text
        doc
          .fontSize(16)
          .fillColor("#1f5582")
          .font("Helvetica-Bold")
          .text("Malang", 50, 50, { width: 300, align: "center" });

        doc
          .fontSize(14)
          .fillColor("#d91e7a")
          .font("Helvetica-Bold")
          .text("रास गार्डिया", 50, 75, { width: 300, align: "center" });
      }
      // Register and use Devanagari font for Marathi text
      const marathiFontPath = path.join(
        __dirname,
        "..",
        "assets",
        "NotoSansDevanagari-Regular.ttf"
      );
      if (fs.existsSync(marathiFontPath)) {
        doc.registerFont("marathi", marathiFontPath);
      }

      // English event name
      // doc
      //   .fontSize(18)
      //   .fillColor("#ffffff")
      //   .font("Helvetica-Bold")
      //   .text("Malang Ras Dandiya Night", 50, 60, {
      //     width: 300,
      //     align: "center",
      //   });

      // Marathi event name (below English, in same header area)
      if (fs.existsSync(marathiFontPath)) {
        doc
          .font("marathi")
          .fontSize(22)
          .fillColor("#ffb366")
          .text("मलंग रस डांडिया", 50, 85, { width: 300, align: "center" });
      }

      // Event details section
      const detailsY = 120; // Move up for less space
      const rowGap = 14; // Reduce gap between rows
      const leftCol = 50;
      const rightCol = 220;

      // Format date to show only "Fri Aug 29 2025" format
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Updated color palette to match logo
      const primaryColor = "#1f5582"; // blue from logo
      const accentColor = "#d91e7a"; // pink from logo
      const orangeColor = "#ffb366"; // orange accent

      // Labels and values
      doc
        .fontSize(10)
        .fillColor(primaryColor)
        .font("Helvetica")
        .text("PLACE:", leftCol, detailsY)
        .text("DATE:", leftCol, detailsY + rowGap)
        .text("PRICE:", leftCol, detailsY + rowGap * 2)
        .text("PASS:", leftCol, detailsY + rowGap * 3)
        .text("TIME:", leftCol, detailsY + rowGap * 4);
      doc
        .fontSize(10)
        .fillColor(primaryColor)
        .font("Helvetica")
        .text("PLACE:", leftCol, detailsY)
        .text("DATE:", leftCol, detailsY + rowGap)
        .text("PRICE:", leftCol, detailsY + rowGap * 2)
        .text("PASS :", leftCol, detailsY + rowGap * 3)
        .text("TIME:", leftCol, detailsY + rowGap * 4);

      // Draw location icon at the end of PLACE line and make it clickable
      const locationIconPath = path.join(
        __dirname,
        "..",
        "assets",
        "location.png"
      );
      const iconX = leftCol + 210;
      const iconY = detailsY - 4;
      // Use a standard Google Maps URL for direct opening
      const mapUrl =
        "https://www.google.com/maps/place/Regal+Lawns+%26+Hall/@19.85035,75.349974,17z";
      if (fs.existsSync(locationIconPath)) {
        doc.image(locationIconPath, iconX, iconY, { width: 20, height: 20 });
        doc.link(iconX, iconY, 20, 20, mapUrl);
      }

      // Values (fetch price and pass_type from ticketData)
      doc
        .fontSize(10)
        .fillColor(accentColor)
        .font("Helvetica-Bold")
        .text("Regal Lawns & Hall", leftCol + 50, detailsY)
        .text(formattedDate, leftCol + 50, detailsY + rowGap)
        .text(
          ticketData.price ? `₹${ticketData.price}` : "-",
          leftCol + 50,
          detailsY + rowGap * 2
        )
        .text(
          pass_type ? pass_type.toUpperCase() : "-",
          leftCol + 50,
          detailsY + rowGap * 3
        )
        .text("7:00 PM - 11:00 PM", leftCol + 50, detailsY + rowGap * 4);

      // Pass type color detail (e.g., for group of girls)
      if (pass_type && pass_type.toLowerCase().includes("girl")) {
        doc
          .fontSize(9)
          .fillColor(orangeColor)
          .font("Helvetica-Bold")
          .text("(Group of Girls)", leftCol + 50, detailsY + rowGap * 3 + 12);
      }

      // Name and Email section in one box
      doc.roundedRect(40, 210, 320, 55, 20).fill(primaryColor);

      doc
        .fontSize(12)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .text(`NAME: ${name.toUpperCase()}`, 50, 225, {
          width: 300,
          align: "center",
        });

      // Email section (if provided)
      if (email) {
        doc
          .fontSize(10)
          .fillColor("#ffffff")
          .font("Helvetica")
          .text(`E-MAIL: ${email.toUpperCase()}`, 50, 245, {
            width: 300,
            align: "center",
          });
      }

      // QR Code section
      const qrY = 280;

      // QR Code background with dashed border
      doc.roundedRect(145, qrY, 110, 110, 10).fill(orangeColor);

      // Dashed border effect (simplified as solid for PDF compatibility)
      doc
        .roundedRect(150, qrY + 5, 100, 100, 8)
        .lineWidth(2)
        .strokeColor("#ffffff")
        .stroke();

      // Add QR Code
      const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
      const qrImagePath = path.join(
        __dirname,
        "..",
        "tickets",
        `qr-${Date.now()}.png`
      );
      fs.writeFileSync(qrImagePath, base64Data, "base64");

      doc.image(qrImagePath, 155, qrY + 10, {
        fit: [90, 90],
      });

      // Footer section (move up to reduce space)
      const footerY = qrY + 120; // Just below QR code
      doc.roundedRect(40, footerY, 180, 25, 12).fill(accentColor);
      doc
        .fontSize(10)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .text("Powered by Malang Ras Dandiya", 50, footerY + 10, {
          width: 160,
          align: "center",
        });

      // Bottom section with rounded corners
      const bottomY = footerY + 35;
      doc.roundedRect(40, bottomY, 320, 25, 12).fill(primaryColor);
      doc
        .fontSize(9)
        .fillColor("#ffffff")
        .font("Helvetica")
        .text(
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          50,
          bottomY + 10,
          {
            width: 300,
            align: "center",
          }
        );

      doc.end();

      stream.on("finish", () => {
        try {
          fs.unlinkSync(qrImagePath); // Cleanup
        } catch (cleanupError) {
          console.log("QR cleanup error:", cleanupError.message);
        }
        resolve(filePath);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      reject(error);
    }
  });
};

module.exports = generateTicketPDF;
