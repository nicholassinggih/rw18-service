import { DataTypes } from 'sequelize';
import ConnectionPool from '../service/data-service.mjs';
const cp = new ConnectionPool();
const sequelize = cp.sequelize;

const Honor = sequelize.define('Honor', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  bulan: {
      type: DataTypes.INTEGER,
      allowNull: true
  },
  tahun: {
      type: DataTypes.INTEGER,
      allowNull: true
  },
  honor: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  beras: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  insAbsen: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  insApel: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  potAbsen: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  potApel: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  iuranKoperasi: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  bonKoperasi: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  bonRwSisa: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  bonKoperasiSisa: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  insLain: {
      type: DataTypes.DECIMAL,
      allowNull: true
  }
}, {
tableName: 'honor'
});

const Karyawan = sequelize.define('Karyawan', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  nama: {
      type: DataTypes.STRING,
      allowNull: true
  },
  bagian: {
      type: DataTypes.STRING,
      allowNull: true
  },
  honor: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  beras: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true
  },
  bpjs: {
      type: DataTypes.BOOLEAN,
      allowNull: true
  },
  terbayar: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  namaBagianSoundex: {
      type: DataTypes.STRING,
      allowNull: true
  }
}, {
tableName: 'karyawan'
});

const FeeHistory = sequelize.define('FeeHistory', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  nominal: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  startDate: {
      type: DataTypes.DATE,
      allowNull: true
  }
}, {
tableName: 'fee_history'
});

const MovementHistory = sequelize.define('MovementHistory', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  startDate: {
      type: DataTypes.DATE,
      allowNull: true
  }
}, {
tableName: 'movement_history'
});



const Collector = sequelize.define('Collector', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  nama: {
      type: DataTypes.STRING,
      allowNull: true
  },
  namaSoundex: {
      type: DataTypes.STRING,
      allowNull: true
  }
}, {
tableName: 'collector'
});

const Pembayaran = sequelize.define('Pembayaran', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  bulan: {
      type: DataTypes.INTEGER,
      allowNull: true
  },
  tahun: {
      type: DataTypes.INTEGER,
      allowNull: true
  },
  nama: {
      type: DataTypes.STRING,
      allowNull: true
  },
  blok: {
      type: DataTypes.STRING,
      allowNull: true
  },
  no: {
      type: DataTypes.STRING,
      allowNull: true
  },
  nominal: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  terbayar: {
      type: DataTypes.DECIMAL,
      allowNull: true
  },
  namaBlokNoSoundex: {
      type: DataTypes.STRING,
      allowNull: true
  }
}, {
tableName: 'pembayaran'
});

const Pemilik = sequelize.define('Pemilik', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: true
    },
    namaSoundex: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
  tableName: 'pemilik'
});

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    blok: {
        type: DataTypes.STRING,
        allowNull: true
    },
    no: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nominal: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    komersial: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    rt: {
        type: DataTypes.TINYINT,
        allowNull: true
    }
}, {
    tableName: 'property'
});

Property.belongsTo(Pemilik);
Property.belongsTo(Collector);
Pembayaran.belongsTo(Pemilik);
FeeHistory.belongsTo(Property);
Honor.belongsTo(Karyawan);
MovementHistory.belongsTo(Property);
MovementHistory.belongsTo(Pemilik);

export {
  Collector,
  FeeHistory,
  Honor,
  Karyawan,
  MovementHistory,
  Pembayaran,
  Pemilik,
  Property
};
